import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Interview, BADGE_DEFINITIONS, BadgeId } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  Trophy, Clock, CheckCircle, XCircle, Mic, BarChart3, ArrowRight,
  Loader2, Flame, Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  newBadges?: BadgeId[];
  streak?: number;
  dailyGoalReached?: boolean;
  questionsAnsweredToday?: number;
  dailyGoal?: number;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  const state = (location.state as LocationState) ?? {};
  const newBadges = state.newBadges ?? [];
  const streak = state.streak ?? 0;
  const dailyGoalReached = state.dailyGoalReached ?? false;
  const questionsAnsweredToday = state.questionsAnsweredToday ?? 0;
  const dailyGoal = state.dailyGoal ?? 10;

  useEffect(() => {
    if (id) {
      interviewAPI
        .getById(id)
        .then((res) => setInterview(res.data.interview))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    refreshUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );

  if (!interview)
    return <div className="p-6 text-center text-slate-500">Interview not found</div>;

  const score = interview.overallScore || 0;
  const correctCount =
    interview.correctCount ?? interview.answers.filter((a) => a.feedback?.isCorrect).length;
  const total = interview.answers.length;

  const scoreColor =
    score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg =
    score >= 70
      ? 'from-green-50'
      : score >= 50
      ? 'from-amber-50'
      : 'from-red-50';

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const barData = interview.answers.map((a, i) => ({
    name: `Q${i + 1}`,
    score: a.feedback?.isCorrect ? 100 : 0,
  }));

  const getMessage = () => {
    if (score >= 90) return '🏆 Outstanding! You nailed it.';
    if (score >= 70) return '🎉 Great job! Keep it up.';
    if (score >= 50) return "📚 Good effort. Review the explanations.";
    return "💪 Keep practicing — you'll get there!";
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* New badges earned */}
      {newBadges.length > 0 && (
        <div className="card mb-6 border border-amber-300 bg-amber-50">
          <h2 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <Trophy size={16} />
            New Badge{newBadges.length > 1 ? 's' : ''} Earned!
          </h2>
          <div className="flex flex-wrap gap-3">
            {newBadges.map((badgeId) => {
              const def = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
              if (!def) return null;
              return (
                <div
                  key={badgeId}
                  className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-3 py-2"
                >
                  <span className="text-xl">{def.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{def.name}</p>
                    <p className="text-xs text-slate-500">{def.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Streak & daily goal highlights */}
      {(streak > 0 || dailyGoalReached) && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {streak > 0 && (
            <div className="card bg-orange-50 border border-orange-200 flex items-center gap-3">
              <Flame size={24} className="text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-slate-900">{streak} day{streak !== 1 ? 's' : ''}</p>
                <p className="text-xs text-slate-500">Current streak 🔥</p>
              </div>
            </div>
          )}
          {dailyGoalReached && (
            <div className="card bg-green-50 border border-green-200 flex items-center gap-3">
              <Target size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-slate-900">Goal reached!</p>
                <p className="text-xs text-slate-500">
                  {questionsAnsweredToday}/{dailyGoal} questions today
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className={`card bg-gradient-to-r ${scoreBg} to-white mb-6`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="text-amber-500" size={20} />
              <h1 className="text-xl font-bold text-slate-900">Interview Complete!</h1>
            </div>
            <p className="text-slate-500 text-sm capitalize">
              {interview.type.replace('-', ' ')} · {interview.difficulty} · {total} questions
            </p>
            <p className="text-sm mt-2 text-slate-700">{getMessage()}</p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>{score}%</div>
            <div className="text-slate-400 text-sm mt-1">
              {correctCount}/{total} correct
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-slate-900 font-semibold">{correctCount}</div>
            <div className="text-xs text-slate-400">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-slate-900 font-semibold">{total - correctCount}</div>
            <div className="text-xs text-slate-400">Wrong</div>
          </div>
          <div className="text-center">
            <div className="text-slate-900 font-semibold flex items-center justify-center gap-1">
              <Clock size={12} />
              {formatDuration(interview.duration)}
            </div>
            <div className="text-xs text-slate-400">Duration</div>
          </div>
        </div>
      </div>

      {/* Score chart */}
      <div className="card mb-6">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-500" />
          Score Per Question
        </h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
              }}
              formatter={(val) => [val === 100 ? '✓ Correct' : '✗ Wrong', '']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Answer breakdown */}
      <div className="card mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Question Review</h2>
        <div className="space-y-4">
          {interview.answers.map((answer, idx) => {
            const isCorrect = answer.feedback?.isCorrect;
            return (
              <div
                key={answer._id}
                className={`border rounded-xl p-4 ${
                  isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={14} className="text-green-600" />
                    ) : (
                      <XCircle size={14} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Q{idx + 1}</p>
                    <p className="text-sm text-slate-900 font-medium">{answer.questionText}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Wrong'}
                  </span>
                </div>

                {answer.feedback && (
                  <div className="ml-9 space-y-1.5">
                    {!isCorrect && (
                      <p className="text-xs text-slate-500">
                        Your answer:{' '}
                        <span className="text-red-600">
                          Option {String.fromCharCode(65 + answer.feedback.selectedOptionIndex)}
                        </span>
                        {' · '}
                        Correct:{' '}
                        <span className="text-green-600">
                          Option {String.fromCharCode(65 + answer.feedback.correctOptionIndex)}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed bg-white rounded-lg p-2 border border-slate-100">
                      💡 {answer.feedback.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/interview/setup"
          className="btn-primary flex items-center justify-center gap-2 flex-1"
        >
          <Mic size={16} />
          Practice Again
        </Link>
        <Link
          to="/analytics"
          className="btn-secondary flex items-center justify-center gap-2 flex-1"
        >
          <BarChart3 size={16} />
          View Analytics
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
