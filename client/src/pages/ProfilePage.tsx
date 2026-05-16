import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { BADGE_DEFINITIONS, ProgressReport } from '../types';
import { User, X, Loader2, CheckCircle, Flame, Trophy, Target, Lock } from 'lucide-react';

const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];
const DAILY_GOAL_OPTIONS = [5, 10, 15, 20];

const TOPIC_LABELS: Record<string, string> = {
  behavioral: 'Behavioral', dsa: 'DSA', 'system-design': 'System Design',
  technical: 'Technical', frontend: 'Frontend', backend: 'Backend',
  devops: 'DevOps', database: 'Database', javascript: 'JavaScript',
  python: 'Python', react: 'React', nodejs: 'Node.js', mixed: 'Mixed', challenge: 'Challenge',
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experience: user?.experience || 'Entry Level',
    skillInput: '',
    skills: user?.skills || [],
    dailyGoal: user?.dailyGoal ?? 10,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ProgressReport | null>(null);

  useEffect(() => {
    analyticsAPI.getProgress().then((res) => setProgress(res.data)).catch(() => null);
  }, []);

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill], skillInput: '' });
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        targetRole: form.targetRole,
        experience: form.experience,
        skills: form.skills,
        dailyGoal: form.dailyGoal,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const earnedBadgeIds = new Set((user?.badges ?? []).map((b) => b.id));

  // Compute total stats from topicStats
  const topicStats = user?.topicStats ?? {};
  const totalAnswered = Object.values(topicStats).reduce((s, t) => s + t.total, 0);
  const totalCorrect = Object.values(topicStats).reduce((s, t) => s + t.correct, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Topic mastery from progress
  const topicMastery = progress
    ? Object.entries(progress.topicStats).map(([type, stat]) => ({
        type,
        pct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
      })).sort((a, b) => b.pct - a.pct)
    : [];

  const masteryColor = (pct: number) =>
    pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  const masteryText = (pct: number) =>
    pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400';

  const streakAtRisk = (() => {
    if (!user?.lastPracticeDate) return false;
    const last = new Date(user.lastPracticeDate);
    const today = new Date();
    const diffMs = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 1 && (user.currentStreak ?? 0) > 0;
  })();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and track your progress</p>
      </div>

      {/* Avatar + quick stats */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-white text-lg">{user?.name}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
            <div className="text-xs text-gray-600 mt-0.5">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-xl">
              <Flame size={18} />
              {user?.currentStreak ?? 0}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{earnedBadgeIds.size}</div>
            <div className="text-xs text-gray-500 mt-0.5">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{totalAnswered}</div>
            <div className="text-xs text-gray-500 mt-0.5">Questions</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {accuracy}%
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Accuracy</div>
          </div>
        </div>

        {/* Streak at risk warning */}
        {streakAtRisk && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <p className="text-sm text-orange-300">
              Your {user?.currentStreak}-day streak is at risk! Practice today to keep it going.
            </p>
          </div>
        )}
      </div>

      {/* Streak info */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          Streak
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
              🔥 {user?.currentStreak ?? 0}
            </div>
            <div className="text-sm text-gray-400 mt-1">Current Streak</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {user?.longestStreak ?? 0}
            </div>
            <div className="text-sm text-gray-400 mt-1">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          Badges ({earnedBadgeIds.size}/{BADGE_DEFINITIONS.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map((def) => {
            const earned = earnedBadgeIds.has(def.id);
            const earnedBadge = user?.badges.find((b) => b.id === def.id);
            return (
              <div
                key={def.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  earned
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-gray-800/30 border-gray-800 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{earned ? def.emoji : '🔒'}</div>
                <p className={`text-xs font-semibold ${earned ? 'text-white' : 'text-gray-500'}`}>
                  {def.name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-tight">{def.description}</p>
                {earned && earnedBadge && (
                  <p className="text-xs text-yellow-600 mt-1">
                    {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                  </p>
                )}
                {!earned && (
                  <div className="flex items-center justify-center mt-1">
                    <Lock size={10} className="text-gray-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic mastery */}
      {topicMastery.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Topic Mastery</h2>
          <div className="space-y-3">
            {topicMastery.map(({ type, pct }) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{TOPIC_LABELS[type] ?? type}</span>
                  <span className={`font-medium ${masteryText(pct)}`}>{pct}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${masteryColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit profile form */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-sm text-green-400 flex items-center gap-2">
          <CheckCircle size={14} />
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="card space-y-5">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <User size={16} className="text-primary-400" />
          Edit Profile
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <input
            type="text" className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            type="email" className="input opacity-60 cursor-not-allowed"
            value={user?.email || ''}
            disabled
          />
          <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Role</label>
            <input
              type="text" className="input"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience Level</label>
            <select
              className="input"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            >
              {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Daily goal */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
            <Target size={14} className="text-primary-400" />
            Daily Goal (questions per day)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DAILY_GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, dailyGoal: g })}
                className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                  form.dailyGoal === g
                    ? 'bg-primary-600/20 border-primary-500/50 text-primary-400'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text" className="input flex-1" placeholder="Add a skill..."
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-3 text-sm">Add</button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span key={skill} className="badge bg-primary-600/20 text-primary-300 border border-primary-500/30 flex items-center gap-1.5">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
