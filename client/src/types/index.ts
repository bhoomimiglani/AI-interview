export type BadgeId =
  | 'first_steps'
  | 'perfect_score'
  | 'on_fire'
  | 'week_warrior'
  | 'dsa_master'
  | 'speed_demon'
  | 'consistent'
  | 'high_achiever';

export interface Badge {
  id: BadgeId;
  earnedAt: string;
}

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

export interface TopicStat {
  attempted: number;
  correct: number;
  total: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  targetRole: string;
  experience: string;
  skills: string[];
  createdAt: string;
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: string;
  // Badges
  badges: Badge[];
  // Topic mastery
  topicStats: Record<string, TopicStat>;
  // Daily goal
  dailyGoal: number;
  questionsAnsweredToday: number;
  lastGoalResetDate?: string;
}

export interface QuestionOption {
  text: string;
  index: number;
}

export interface Question {
  _id: string;
  text: string;
  type: 'behavioral' | 'dsa' | 'system-design' | 'technical';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  options: QuestionOption[];
  timeLimit: number;
}

export interface AnswerFeedback {
  isCorrect: boolean;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  explanation: string;
  score: number;
}

export interface Answer {
  _id: string;
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  timeTaken: number;
  feedback?: AnswerFeedback;
  submittedAt: string;
}

export interface Interview {
  _id: string;
  userId: string;
  title: string;
  type: 'behavioral' | 'dsa' | 'mixed' | 'system-design' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in-progress' | 'completed' | 'abandoned';
  isChallenge?: boolean;
  answers: Answer[];
  overallScore?: number;
  overallFeedback?: string;
  duration: number;
  questionsCount: number;
  correctCount?: number;
  completedAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  scoreTrend: { session: string; score: number; date?: string }[];
  typePerformance: { type: string; avgScore: number; count: number }[];
  difficultyPerformance: { difficulty: string; avgScore: number; count: number }[];
  skillBreakdown: { communication: number; technical: number; confidence: number };
  recentInterviews: Interview[];
  last7Days: { date: string; count: number; avgScore: number }[];
}

export interface ProgressReport {
  progressData: {
    index: number;
    score: number;
    type: string;
    difficulty: string;
    date: string;
    questionsAnswered: number;
  }[];
  improvementRate: number;
  totalSessions: number;
  weakTopics: { type: string; avgScore: number }[];
  bestTopic: { type: string; avgScore: number } | null;
  topicStats: Record<string, TopicStat>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  targetRole: string;
  totalScore: number;
  completedInterviews: number;
  averageScore: number;
  currentStreak: number;
  badgeCount: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  targetRole?: string;
  experience?: string;
  skills?: string[];
}

export interface CompleteInterviewResult {
  interview: Interview;
  overallScore: number;
  correctCount: number;
  total: number;
  newBadges: BadgeId[];
  streak: number;
  questionsAnsweredToday: number;
  dailyGoal: number;
  dailyGoalReached: boolean;
}
