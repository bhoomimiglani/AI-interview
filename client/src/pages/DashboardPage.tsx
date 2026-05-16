import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, interviewAPI } from '../services/api';
import { DashboardStats, BADGE_DEFINITIONS } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  Mic, BarChart3, Trophy, TrendingUp, Clock, ArrowRight, Loader2,
  Target, Flame, Zap, Star,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [challengeLoading, setChallengeLoading] = useState(false);

  useEffect(() => {
    analyticsAPI
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChallengeStart = async () => {
    setChallengeLoading(true);
    try {
      const res = await interviewAPI.start({
        type: 'mixed',
        difficulty: 'medium',
        questionsCount: 20,
        isChallenge: true,
      });
      const { interview, questions } = res.data;
      sessionStorage.setItem(`interview_${interview._id}`, JSON.stringify(questions));
      navigate(`/interview/${interview._id}`, { state: { isChallenge: true } });
    } catch (err) {
      console.error(err);
    } finally {
      setChallengeLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );

  const scoreColor = (s: number) =>
    s >= 70 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';

  const currentStreak = user?.currentStreak ?? 0;
  const dailyGoal = user?.dailyGoal ?? 10;
  const questionsToday = user?.questionsAnsweredToday ?? 0;
  const dailyProgress = Math.min(100, Math.round((questionsToday / dailyGoal) * 100));
  const earnedBadges = user?.badges ?? [];
  const recentBadges = earnedBadges.slice(-3).reverse();

  const streakAtRisk = (() => {
    if (!user?.lastPracticeDate) return false;
    const last = new Date(user.lastPracticeDate);
    const today = new Date();
    const diffMs = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 1 && currentStreak > 0;
  })();

  const getMotivationalMessage = () => {
    const avg = stats?.averageScore ?? 0;
    if (avg === 0) return "Start your first interview to begin your journey! 🚀";
    if (avg >= 80) return "You're crushing it! Keep up the excellent work! 🌟";
    if (avg >= 60) return "Great progress! A little more practice and you'll be unstoppable! 💪";
    return "Every expert was once a beginner. Keep practicing! 📚";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">{getMotivationalMessage()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleChallengeStart}
            disabled={challengeLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-xl text-sm font-medium transition-all"
          >
            {challengeLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} />
            )}
            Challenge Mode
          </button>
          <Link to="/interview/setup" className="btn-primary flex items-center gap-2">
            <Mic size={16} />
            New Interview
          </Link>
        </div>
      </div>

      {/* Streak at risk warning */}
      {streakAtRisk && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          <p className="text-sm text-orange-300">
            Your {currentStreak}-day streak is at risk! Practice today to keep it going. 🔥
          </p>
        </div>
      )}

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Streak */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-sm text-gray-400">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-1">
            {currentStreak} 🔥
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Best: {user?.longestStreak ?? 0} days
          </div>
        </div>

        {/* Badges */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-yellow-400" />
            <span className="text-sm text-gray-400">Badges</span>
          </div>
          <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">of {BADGE_DEFINITIONS.length} total</div>
        </div>

        {/* Avg Score */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Star size={18} className="text-primary-400" />
            <span className="text-sm text-gray-400">Avg Score</span>
          </div>
          <div className={`text-2xl font-bold ${scoreColor(stats?.averageScore ?? 0)}`}>
            {stats?.averageScore ?? 0}%
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{stats?.completedInterviews ?? 0} completed</div>
        </div>

        {/* Daily Goal */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-green-400" />
            <span className="text-sm text-gray-400">Daily Goal</span>
          </div>
          <div className="text-sm font-semibold text-white mb-1.5">
            {questionsToday}/{dailyGoal} questions
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                dailyProgress >= 100 ? 'bg-green-500' : 'bg-primary-500'
              }`}
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          {dailyProgress >= 100 && (
            <div className="text-xs text-green-400 mt-1">Goal reached! 🎉</div>
          )}
        </div>
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              Recent Badges
            </h2>
            <Link to="/profile" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {recentBadges.map((badge) => {
              const def = BADGE_DEFINITIONS.find((d) => d.id === badge.id);
              if (!def) return null;
              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2"
                >
                  <span className="text-lg">{def.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{def.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Score trend */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-400" />
            Score Trend
          </h2>
          {stats?.scoreTrend && stats.scoreTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="session" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Complete interviews to see your trend</p>
              </div>
            </div>
          )}
        </div>

        {/* 7-day activity */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            Last 7 Days
          </h2>
          {stats?.last7Days && stats.last7Days.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 8,
                  }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              No activity this week
            </div>
          )}
        </div>
      </div>

      {/* Performance by type */}
      {stats?.typePerformance && stats.typePerformance.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-4">Performance by Interview Type</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.typePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="type" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: 8,
                }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent interviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Interviews</h2>
          <Link
            to="/history"
            className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats?.recentInterviews && stats.recentInterviews.length > 0 ? (
          <div className="space-y-3">
            {stats.recentInterviews.slice(0, 5).map((interview) => (
              <Link
                key={interview._id}
                to={`/interview/${interview._id}/results`}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <Mic size={14} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {interview.type.replace('-', ' ')} Interview
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {interview.completedAt
                        ? new Date(interview.completedAt).toLocaleDateString()
                        : 'In progress'}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${scoreColor(interview.overallScore || 0)}`}>
                  {interview.overallScore || 0}%
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Mic size={32} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm mb-4">No interviews yet. Start your first one!</p>
            <Link
              to="/interview/setup"
              className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
            >
              <Mic size={14} />
              Start Interview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
