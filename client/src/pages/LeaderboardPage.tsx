import React, { useEffect, useState } from 'react';
import { leaderboardAPI } from '../services/api';
import { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Medal, Loader2, BarChart3 } from 'lucide-react';

const medalColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
const medalBg = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-500/10 border-gray-500/30', 'bg-amber-600/10 border-amber-600/30'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI
      .get()
      .then((res) => setLeaderboard(res.data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-400" size={24} />
          Leaderboard
        </h1>
        <p className="text-gray-400 mt-1">Top performers ranked by average score</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 size={40} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-500">No data yet. Complete interviews to appear here!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Reorder: 2nd, 1st, 3rd for podium effect */}
              {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                if (!entry) return <div key={podiumIdx} />;
                const rankIdx = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2;
                const isCurrentUser = entry.userId === user?._id;
                return (
                  <div
                    key={entry.userId}
                    className={`card border text-center ${medalBg[rankIdx]} ${
                      isCurrentUser ? 'ring-2 ring-primary-500' : ''
                    } ${podiumIdx === 1 ? 'scale-105' : ''}`}
                  >
                    <div className="text-3xl mb-2">
                      {rankIdx === 0 ? '🥇' : rankIdx === 1 ? '🥈' : '🥉'}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-2 ${
                        isCurrentUser ? 'bg-primary-600' : 'bg-gray-700'
                      }`}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-white text-sm truncate">{entry.name}</p>
                    <p className="text-xs text-gray-500 truncate mb-2">{entry.targetRole}</p>
                    <div className={`text-2xl font-bold ${medalColors[rankIdx]}`}>
                      {entry.averageScore}%
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">avg score</p>
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-gray-800">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-white">{entry.completedInterviews}</p>
                        <p className="text-xs text-gray-600">done</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-orange-400 flex items-center gap-0.5">
                          <Flame size={10} />{entry.currentStreak}
                        </p>
                        <p className="text-xs text-gray-600">streak</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Rank</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">User</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Avg Score</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Completed</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Streak</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.userId === user?._id;
                  return (
                    <tr
                      key={entry.userId}
                      className={`border-b border-gray-800/50 transition-colors ${
                        isCurrentUser
                          ? 'bg-primary-600/10'
                          : 'hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {entry.rank <= 3 ? (
                            <Medal
                              size={16}
                              className={medalColors[entry.rank - 1]}
                            />
                          ) : (
                            <span className="text-sm text-gray-500 w-4 text-center">
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                              isCurrentUser ? 'bg-primary-600' : 'bg-gray-700'
                            }`}
                          >
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {entry.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-primary-400">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{entry.targetRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-sm font-bold ${
                            entry.averageScore >= 70
                              ? 'text-green-400'
                              : entry.averageScore >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {entry.averageScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <span className="text-sm text-gray-300">{entry.completedInterviews}</span>
                      </td>
                      <td className="py-3 px-4 text-right hidden md:table-cell">
                        <span className="text-sm text-orange-400 flex items-center justify-end gap-1">
                          <Flame size={12} />
                          {entry.currentStreak}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right hidden md:table-cell">
                        <span className="text-sm text-gray-300">{entry.badgeCount}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
