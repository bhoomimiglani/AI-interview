import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { ProgressReport } from '../types';
import { Loader2, TrendingUp, AlertTriangle, Star, BookOpen } from 'lucide-react';

const TOPIC_LABELS: Record<string, string> = {
  behavioral: 'Behavioral',
  dsa: 'DSA',
  'system-design': 'System Design',
  technical: 'Technical',
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  database: 'Database',
  javascript: 'JavaScript',
  python: 'Python',
  react: 'React',
  nodejs: 'Node.js',
  mixed: 'Mixed',
  challenge: 'Challenge',
};

const IMPROVEMENT_SUGGESTIONS: Record<string, string> = {
  behavioral: 'Practice STAR method stories. Focus on leadership and conflict resolution examples.',
  dsa: 'Review Big-O notation, practice LeetCode easy/medium problems daily.',
  'system-design': 'Study scalability patterns, caching, load balancing, and database sharding.',
  technical: 'Brush up on CS fundamentals: OS, networking, and data structures.',
  frontend: 'Review HTML semantics, CSS layout, and browser performance optimization.',
  backend: 'Study REST API design, authentication patterns, and database optimization.',
  devops: 'Practice Docker, CI/CD pipelines, and cloud service concepts.',
  database: 'Review SQL joins, indexing strategies, and ACID properties.',
  javascript: 'Deep dive into closures, promises, event loop, and ES6+ features.',
  python: 'Study Python data structures, decorators, generators, and async patterns.',
  react: 'Review hooks, component lifecycle, state management, and performance.',
  nodejs: 'Study event loop, streams, clustering, and Express middleware.',
  mixed: 'Focus on your weakest individual topics for the most improvement.',
  challenge: 'Practice speed and accuracy — try timed drills on your weak topics.',
};

function getMasteryColor(pct: number): string {
  if (pct >= 70) return 'bg-green-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getMasteryTextColor(pct: number): string {
  if (pct >= 70) return 'text-green-400';
  if (pct >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI
      .getProgress()
      .then((res) => setProgress(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );

  if (!progress || progress.totalSessions === 0)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Topic Mastery</h1>
          <p className="text-gray-400 mt-1">Track your progress across all topics</p>
        </div>
        <div className="card text-center py-12">
          <BookOpen size={40} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-500">Complete interviews to see your topic mastery!</p>
        </div>
      </div>
    );

  // Build topic mastery from topicStats
  const topicMastery = Object.entries(progress.topicStats).map(([type, stat]) => {
    const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    return { type, pct, attempted: stat.attempted, correct: stat.correct, total: stat.total };
  }).sort((a, b) => b.pct - a.pct);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Topic Mastery</h1>
        <p className="text-gray-400 mt-1">Your performance breakdown by topic</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-2xl font-bold text-white">{progress.totalSessions}</div>
          <div className="text-sm text-gray-500 mt-0.5">Total Sessions</div>
        </div>
        <div className="card">
          <div className={`text-2xl font-bold ${progress.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {progress.improvementRate > 0 ? '+' : ''}{progress.improvementRate}%
          </div>
          <div className="text-sm text-gray-500 mt-0.5">Improvement Rate</div>
        </div>
        {progress.bestTopic && (
          <div className="card">
            <div className="text-lg font-bold text-green-400">
              {TOPIC_LABELS[progress.bestTopic.type] ?? progress.bestTopic.type}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">Best Topic ({progress.bestTopic.avgScore}%)</div>
          </div>
        )}
        <div className="card">
          <div className="text-2xl font-bold text-red-400">{progress.weakTopics.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Weak Topics</div>
        </div>
      </div>

      {/* Topic mastery bars */}
      {topicMastery.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-400" />
            Topic Mastery
          </h2>
          <div className="space-y-5">
            {topicMastery.map(({ type, pct, attempted, correct, total }) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {TOPIC_LABELS[type] ?? type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {correct}/{total} correct · {attempted} session{attempted !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${getMasteryTextColor(pct)}`}>{pct}%</span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getMasteryColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-red-500" /> &lt;40% Needs work
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-yellow-500" /> 40–70% Getting there
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-green-500" /> &gt;70% Mastered
            </div>
          </div>
        </div>
      )}

      {/* Weak topics & suggestions */}
      {progress.weakTopics.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            Areas to Improve
          </h2>
          <div className="space-y-3">
            {progress.weakTopics.map(({ type, avgScore }) => (
              <div
                key={type}
                className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">
                    {TOPIC_LABELS[type] ?? type}
                  </span>
                  <span className="text-sm font-bold text-red-400">{avgScore}% avg</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  💡 {IMPROVEMENT_SUGGESTIONS[type] ?? 'Practice more questions in this topic.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best topic highlight */}
      {progress.bestTopic && (
        <div className="card border border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-yellow-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">
                Best Topic: {TOPIC_LABELS[progress.bestTopic.type] ?? progress.bestTopic.type}
              </p>
              <p className="text-sm text-gray-400">
                You're averaging {progress.bestTopic.avgScore}% — keep it up!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
