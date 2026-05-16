import { Request, Response } from 'express';
import Interview from '../models/Interview.model';
import Question from '../models/Question.model';
import User from '../models/User.model';
import { seedQuestions } from '../services/seed.service';
import {
  checkAndAwardBadges,
  updateStreak,
  updateTopicStats,
  resetDailyGoalIfNeeded,
} from '../services/badge.service';

export const startInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, difficulty, questionsCount = 10, isChallenge = false } = req.body;
    const userId = (req as any).userId;

    // Ensure questions exist
    const count = await Question.countDocuments();
    if (count === 0) await seedQuestions();

    const query: Record<string, unknown> = {};
    // For challenge mode, use 'mixed' type questions
    const effectiveType = isChallenge ? 'mixed' : type;
    if (effectiveType !== 'mixed') query.type = effectiveType;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: Number(questionsCount) } },
    ]);

    if (questions.length === 0) {
      res.status(404).json({ message: 'No questions found for the selected criteria' });
      return;
    }

    const interview = await Interview.create({
      userId,
      title: isChallenge
        ? `Challenge Mode - ${new Date().toLocaleDateString()}`
        : `${type.charAt(0).toUpperCase() + type.slice(1)} Interview - ${new Date().toLocaleDateString()}`,
      type: isChallenge ? 'challenge' : type,
      difficulty: difficulty || 'medium',
      status: 'in-progress',
      questionsCount: questions.length,
      isChallenge: Boolean(isChallenge),
      answers: [],
    });

    // Strip isCorrect from options before sending to client
    const safeQuestions = questions.map((q) => ({
      ...q,
      options: q.options.map((o: { text: string; isCorrect: boolean }, idx: number) => ({
        text: o.text,
        index: idx,
      })),
    }));

    res.status(201).json({ interview, questions: safeQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Error starting interview', error });
  }
};

export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const { questionId, questionText, selectedOptionIndex, timeTaken } = req.body;
    const userId = (req as any).userId;

    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    // Get question to check correct answer
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    const correctOptionIndex = question.options.findIndex((o) => o.isCorrect);
    const isCorrect = Number(selectedOptionIndex) === correctOptionIndex;

    const feedback = {
      isCorrect,
      selectedOptionIndex: Number(selectedOptionIndex),
      correctOptionIndex,
      explanation: question.explanation,
      score: isCorrect ? 100 : 0,
    };

    const answer = {
      questionId,
      questionText,
      selectedOptionIndex: Number(selectedOptionIndex),
      timeTaken: Number(timeTaken) || 0,
      feedback,
      submittedAt: new Date(),
    };

    interview.answers.push(answer as Parameters<typeof interview.answers.push>[0]);
    await interview.save();

    res.json({
      isCorrect,
      correctOptionIndex,
      explanation: question.explanation,
      correctOptionText: question.options[correctOptionIndex].text,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting answer', error });
  }
};

export const completeInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const { duration } = req.body;
    const userId = (req as any).userId;

    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    const correctCount = interview.answers.filter((a) => a.feedback?.isCorrect).length;
    const total = interview.answers.length;
    const overallScore = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    interview.status = 'completed';
    interview.overallScore = overallScore;
    interview.correctCount = correctCount;
    interview.overallFeedback = `You answered ${correctCount} out of ${total} questions correctly (${overallScore}%).`;
    interview.duration = duration || 0;
    interview.completedAt = new Date();
    await interview.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      // Reset daily goal if new day
      resetDailyGoalIfNeeded(user);

      // Update daily questions answered
      user.questionsAnsweredToday += total;

      // Update streak
      updateStreak(user);

      // Update topic stats
      updateTopicStats(user, interview.type, correctCount, total);

      // Check and award badges
      const newBadges = await checkAndAwardBadges(user, interviewId);

      await user.save();

      res.json({
        interview,
        overallScore,
        correctCount,
        total,
        newBadges,
        streak: user.currentStreak,
        questionsAnsweredToday: user.questionsAnsweredToday,
        dailyGoal: user.dailyGoal,
        dailyGoalReached: user.questionsAnsweredToday >= user.dailyGoal,
      });
      return;
    }

    res.json({ interview, overallScore, correctCount, total, newBadges: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error completing interview', error });
  }
};

export const getInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, status } = req.query;

    const query: Record<string, unknown> = { userId };
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Interview.countDocuments(query);

    res.json({
      interviews,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error });
  }
};

export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const userId = (req as any).userId;

    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview', error });
  }
};
