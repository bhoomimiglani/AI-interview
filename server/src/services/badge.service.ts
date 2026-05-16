import User, { BadgeId, IUser } from '../models/User.model';
import Interview from '../models/Interview.model';

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first interview', emoji: '🎯' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on any interview', emoji: '💯' },
  { id: 'on_fire', name: 'On Fire', description: 'Maintain a 3-day streak', emoji: '🔥' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', emoji: '⚔️' },
  { id: 'dsa_master', name: 'DSA Master', description: 'Complete 5 DSA interviews', emoji: '🧠' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete an interview in under 2 minutes', emoji: '⚡' },
  { id: 'consistent', name: 'Consistent', description: 'Complete 10 total interviews', emoji: '🏆' },
  { id: 'high_achiever', name: 'High Achiever', description: 'Maintain an average score above 80%', emoji: '🌟' },
];

/**
 * Check and award any newly earned badges for a user after completing an interview.
 * Returns array of newly earned badge IDs.
 */
export async function checkAndAwardBadges(
  user: IUser,
  interviewId: string
): Promise<BadgeId[]> {
  const newlyEarned: BadgeId[] = [];
  const existingIds = new Set(user.badges.map((b) => b.id));

  const completedInterviews = await Interview.find({
    userId: user._id,
    status: 'completed',
  }).lean();

  const currentInterview = completedInterviews.find(
    (i) => i._id.toString() === interviewId
  );

  // Helper to award badge if not already earned
  const award = (id: BadgeId) => {
    if (!existingIds.has(id)) {
      user.badges.push({ id, earnedAt: new Date() });
      existingIds.add(id);
      newlyEarned.push(id);
    }
  };

  // 1. First Steps — complete first interview
  if (completedInterviews.length >= 1) {
    award('first_steps');
  }

  // 2. Perfect Score — score 100% on any interview
  if (completedInterviews.some((i) => (i.overallScore ?? 0) === 100)) {
    award('perfect_score');
  }

  // 3. On Fire — 3-day streak
  if (user.currentStreak >= 3) {
    award('on_fire');
  }

  // 4. Week Warrior — 7-day streak
  if (user.currentStreak >= 7) {
    award('week_warrior');
  }

  // 5. DSA Master — complete 5 DSA interviews
  const dsaCount = completedInterviews.filter((i) => i.type === 'dsa').length;
  if (dsaCount >= 5) {
    award('dsa_master');
  }

  // 6. Speed Demon — complete interview in under 2 minutes (120 seconds)
  if (currentInterview && currentInterview.duration > 0 && currentInterview.duration < 120) {
    award('speed_demon');
  }

  // 7. Consistent — complete 10 total interviews
  if (completedInterviews.length >= 10) {
    award('consistent');
  }

  // 8. High Achiever — average score above 80%
  if (completedInterviews.length > 0) {
    const avg =
      completedInterviews.reduce((sum, i) => sum + (i.overallScore ?? 0), 0) /
      completedInterviews.length;
    if (avg > 80) {
      award('high_achiever');
    }
  }

  return newlyEarned;
}

/**
 * Update streak for a user. Call after completing an interview.
 */
export function updateStreak(user: IUser): void {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastPracticeDate) {
    user.currentStreak = 1;
    user.longestStreak = Math.max(user.longestStreak, 1);
    user.lastPracticeDate = today;
    return;
  }

  const last = new Date(user.lastPracticeDate);
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const diffMs = today.getTime() - lastDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already practiced today — no change
    return;
  } else if (diffDays === 1) {
    // Consecutive day
    user.currentStreak += 1;
  } else {
    // Streak broken
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  user.lastPracticeDate = today;
}

/**
 * Update per-topic stats after an interview.
 */
export function updateTopicStats(
  user: IUser,
  interviewType: string,
  correctCount: number,
  totalCount: number
): void {
  const existing = user.topicStats.get(interviewType) ?? {
    attempted: 0,
    correct: 0,
    total: 0,
  };

  existing.attempted += 1;
  existing.correct += correctCount;
  existing.total += totalCount;

  user.topicStats.set(interviewType, existing);
}

/**
 * Reset daily goal counter if it's a new day.
 */
export function resetDailyGoalIfNeeded(user: IUser): void {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastGoalResetDate) {
    user.questionsAnsweredToday = 0;
    user.lastGoalResetDate = today;
    return;
  }

  const last = new Date(user.lastGoalResetDate);
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  if (today.getTime() > lastDay.getTime()) {
    user.questionsAnsweredToday = 0;
    user.lastGoalResetDate = today;
  }
}
