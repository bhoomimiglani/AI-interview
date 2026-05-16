import { Request, Response } from 'express';
import Interview from '../models/Interview.model';
import User from '../models/User.model';

export const getLeaderboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Aggregate top users by total score and completed interviews
    const leaderboardData = await Interview.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$overallScore' },
          completedInterviews: { $sum: 1 },
          avgScore: { $avg: '$overallScore' },
        },
      },
      { $sort: { avgScore: -1, completedInterviews: -1 } },
      { $limit: 20 },
    ]);

    // Fetch user details for each entry
    const userIds = leaderboardData.map((d) => d._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name targetRole currentStreak badges')
      .lean();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const leaderboard = leaderboardData
      .map((entry, idx) => {
        const user = userMap.get(entry._id.toString());
        if (!user) return null;
        return {
          rank: idx + 1,
          userId: entry._id,
          name: user.name,
          targetRole: user.targetRole,
          totalScore: Math.round(entry.totalScore),
          completedInterviews: entry.completedInterviews,
          averageScore: Math.round(entry.avgScore),
          currentStreak: user.currentStreak,
          badgeCount: (user.badges as unknown[]).length,
        };
      })
      .filter(Boolean);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};
