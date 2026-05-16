import { Request, Response } from 'express';
import Interview from '../models/Interview.model';
import User from '../models/User.model';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const [totalInterviews, completedInterviews, recentInterviews] = await Promise.all([
      Interview.countDocuments({ userId }),
      Interview.countDocuments({ userId, status: 'completed' }),
      Interview.find({ userId, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(10)
        .select('overallScore type difficulty completedAt duration correctCount questionsCount'),
    ]);

    // Average score
    const scoreAgg = await Interview.aggregate([
      { $match: { userId: userId as unknown, status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } },
    ]);
    const averageScore = scoreAgg[0]?.avgScore ? Math.round(scoreAgg[0].avgScore) : 0;

    // Score trend (last 7 interviews)
    const scoreTrend = recentInterviews.slice(0, 7).reverse().map((i, idx) => ({
      session: `Session ${idx + 1}`,
      score: i.overallScore || 0,
      date: i.completedAt?.toLocaleDateString(),
    }));

    // Performance by type
    const typePerformance = await Interview.aggregate([
      { $match: { userId: userId as unknown, status: 'completed' } },
      { $group: { _id: '$type', avgScore: { $avg: '$overallScore' }, count: { $sum: 1 } } },
    ]);

    // Performance by difficulty
    const difficultyPerformance = await Interview.aggregate([
      { $match: { userId: userId as unknown, status: 'completed' } },
      { $group: { _id: '$difficulty', avgScore: { $avg: '$overallScore' }, count: { $sum: 1 } } },
    ]);

    // Skill breakdown from answers
    const skillBreakdown = await Interview.aggregate([
      { $match: { userId: userId as unknown, status: 'completed' } },
      { $unwind: '$answers' },
      { $match: { 'answers.feedback': { $exists: true } } },
      {
        $group: {
          _id: null,
          avgCommunication: { $avg: '$answers.feedback.communicationScore' },
          avgTechnical: { $avg: '$answers.feedback.technicalScore' },
          avgConfidence: { $avg: '$answers.feedback.confidenceScore' },
        },
      },
    ]);

    const skills = skillBreakdown[0] || {
      avgCommunication: 0,
      avgTechnical: 0,
      avgConfidence: 0,
    };

    // Last 7 days activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyActivity = await Interview.aggregate([
      {
        $match: {
          userId: userId as unknown,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const last7Days: { date: string; count: number; avgScore: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = dailyActivity.find((a) => a._id === dateStr);
      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: found?.count ?? 0,
        avgScore: found?.avgScore ? Math.round(found.avgScore) : 0,
      });
    }

    res.json({
      totalInterviews,
      completedInterviews,
      averageScore,
      scoreTrend,
      typePerformance: typePerformance.map((t) => ({
        type: t._id,
        avgScore: Math.round(t.avgScore),
        count: t.count,
      })),
      difficultyPerformance: difficultyPerformance.map((d) => ({
        difficulty: d._id,
        avgScore: Math.round(d.avgScore),
        count: d.count,
      })),
      skillBreakdown: {
        communication: Math.round(skills.avgCommunication || 0),
        technical: Math.round(skills.avgTechnical || 0),
        confidence: Math.round(skills.avgConfidence || 0),
      },
      recentInterviews,
      last7Days,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
};

export const getProgressReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const interviews = await Interview.find({ userId, status: 'completed' })
      .sort({ completedAt: 1 })
      .select('overallScore type difficulty completedAt answers correctCount questionsCount');

    const progressData = interviews.map((interview, idx) => ({
      index: idx + 1,
      score: interview.overallScore || 0,
      type: interview.type,
      difficulty: interview.difficulty,
      date: interview.completedAt,
      questionsAnswered: interview.answers.length,
    }));

    // Calculate improvement rate
    const firstHalf = progressData.slice(0, Math.floor(progressData.length / 2));
    const secondHalf = progressData.slice(Math.floor(progressData.length / 2));

    const firstAvg = firstHalf.length
      ? firstHalf.reduce((a, b) => a + b.score, 0) / firstHalf.length
      : 0;
    const secondAvg = secondHalf.length
      ? secondHalf.reduce((a, b) => a + b.score, 0) / secondHalf.length
      : 0;

    const improvementRate =
      firstAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0;

    // Weak topics (score < 50%)
    const topicScores: Record<string, { total: number; count: number }> = {};
    interviews.forEach((i) => {
      if (!topicScores[i.type]) topicScores[i.type] = { total: 0, count: 0 };
      topicScores[i.type].total += i.overallScore || 0;
      topicScores[i.type].count += 1;
    });

    const weakTopics = Object.entries(topicScores)
      .map(([type, data]) => ({
        type,
        avgScore: Math.round(data.total / data.count),
      }))
      .filter((t) => t.avgScore < 50)
      .sort((a, b) => a.avgScore - b.avgScore);

    const bestTopic = Object.entries(topicScores)
      .map(([type, data]) => ({
        type,
        avgScore: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0] ?? null;

    // Fetch user topic stats
    const user = await User.findById(userId).select('topicStats');
    const topicStatsObj: Record<string, { attempted: number; correct: number; total: number }> = {};
    if (user?.topicStats) {
      user.topicStats.forEach((val, key) => {
        topicStatsObj[key] = val;
      });
    }

    res.json({
      progressData,
      improvementRate,
      totalSessions: interviews.length,
      weakTopics,
      bestTopic,
      topicStats: topicStatsObj,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress report', error });
  }
};
