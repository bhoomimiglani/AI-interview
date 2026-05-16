import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { DashboardStats, ProgressReport } from '../types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, BarChart3, Target, Loader2, Award, AlertTriangle, Star,
} from 'lucide-react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const TOPIC_LABELS: Record<string, string> = {
  behavioral: 'Behavioral', dsa: 'DSA', 'system-design': 'System Design',
  technical: 'Technical', frontend: 'Frontend', backend: 'Backend',
  devops: 'DevOps', database: 'Database', javascript: 'JavaScript',
  python: 'Python', react: 'React', nodejs: 'Node.js', mixed: 'Mixed', challenge: 'Challenge',
};

const IMPROVEMENT_SUGGESTIONS: Record<string, string> = {
  behavioral: 'Practice STAR method stories.',
  dsa: 'Review Big-O notation and practice LeetCode problems.',
  'system-design': 'Study scalability patterns and caching.',
  technical: 'Brush up on CS fundamentals.',
  frontend: 'Review HTML semantics and CSS layout.',
  backend: 'Study REST API design and authentication.',
  devops: 'Practice Docker and CI/CD pipelines.',
  database: 'Review SQL joins and indexing strategies.',
  javascript: 'Deep dive into closures and the event loop.',
  python: 'Study decorators, generators, and async patterns.',
  react: 'Review hooks, state management, and performance.',
  nodejs: 'Study event loop, streams, and clustering.',
  mixed: 'Focus on your weakest individual topics.',
  challenge: 'Practice speed and accuracy with timed drills.',
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getDashboard(), analyticsAPI.getProgress()])
      .then(([dashRes, progRes]) => {
        setStats(dashRes.data);
        setProgress(progRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );

  const radarData = stats
    ? [
        { skill: 'Communication', value: stats.skillBreakdown.communication },
        { skill: 'Technical', value: stats.skillBreakdown.technical },
        { skill: 'Confidence', value: stats.skillBreakdown.confidence },
        { skill: 'Overall', value: stats.averageScore },
      ]
    : [];

  const scoreColor = (s: number) =>
    s >= 70 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
        <p className="text-gray-400 mt-1">Deep dive into your interview performance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Sessions',
            value: stats?.totalInterviews || 0,
            icon: BarChart3,
            color: 'text-blue-400',
          },
          {
            label: 'Avg Score',
            value: `${stats?.averageScore || 0}%`,
            icon: Target,
            color: 'text-primary-400',
          },
          {
            label: 'Improvement',
            value: progress?.improvementRate
              ? `${progress.improvementRate > 0 ? '+' : ''}${progress.improvementRate}%`
              : 'N/A',
            icon: TrendingUp,
            color: 'text-green-400',
          },
          {
            label: 'Best Score',
            value: stats?.scoreTrend?.length
              ? `${Math.max(...stats.scoreTrend.map((s) => s.score))}%`
              : 'N/A',
            icon: Award,
            color: 'text-yellow-400',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Score trend */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-400" />
            Score Trend
          </h2>
          {stats?.scoreTrend && stats.scoreTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
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
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              Complete interviews to see your trend
            </div>
          )}
        </div>

        {/* 7-day activity */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-green-400" />
            Last 7 Days Activity
          </h2>
          {stats?.last7Days && stats.last7Days.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Skill radar */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Skill Radar</h2>
          {radarData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              No data yet
            </div>
          )}
        </div>

        {/* By difficulty */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Performance by Difficulty</h2>
          {stats?.difficultyPerformance && stats.difficultyPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.difficultyPerformance}
                  dataKey="avgScore"
                  nameKey="difficulty"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ difficulty, avgScore }: { difficulty: string; avgScore: number }) =>
                    `${difficulty}: ${avgScore}%`
                  }
                >
                  {stats.difficultyPerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* By type */}
      {stats?.typePerformance && stats.typePerformance.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-4">Performance by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.typePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="type" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
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

      {/* Weak topics */}
      {progress?.weakTopics && progress.weakTopics.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            Weak Topics (below 50%)
          </h2>
          <div className="space-y-3">
            {progress.weakTopics.map(({ type, avgScore }) => (
              <div
                key={type}
                className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">
                    {TOPIC_LABELS[type] ?? type}
                  </span>
                  <span className="text-sm font-bold text-red-400">{avgScore}%</span>
                </div>
                <p className="text-xs text-gray-400">
                  💡 {IMPROVEMENT_SUGGESTIONS[type] ?? 'Practice more questions in this topic.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best topic */}
      {progress?.bestTopic && (
        <div className="card mb-6 border border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-yellow-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">
                Best Topic: {TOPIC_LABELS[progress.bestTopic.type] ?? progress.bestTopic.type}
              </p>
              <p className="text-sm text-gray-400">
                Averaging {progress.bestTopic.avgScore}% — you're excelling here!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skill breakdown detail */}
      <div className="card">
        <h2 className="font-semibold text-white mb-6">Detailed Skill Breakdown</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {stats &&
            [
              {
                label: 'Communication',
                value: stats.skillBreakdown.communication,
                desc: 'Clarity, structure, and articulation of answers',
              },
              {
                label: 'Technical Depth',
                value: stats.skillBreakdown.technical,
                desc: 'Accuracy and depth of technical knowledge',
              },
              {
                label: 'Confidence',
                value: stats.skillBreakdown.confidence,
                desc: 'Tone, certainty, and delivery style',
              },
            ].map(({ label, value, desc }) => (
              <div key={label} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={value >= 70 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - value / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${scoreColor(value)}`}>{value}</span>
                  </div>
                </div>
                <div className="font-medium text-white">{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
