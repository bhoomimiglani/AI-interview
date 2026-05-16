import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import {
  Brain, Code2, MessageSquare, Layers, Loader2, ChevronRight,
  Globe, Server, Container, Database, FileCode, Coffee, Atom, Terminal, Zap
} from 'lucide-react';

const interviewTypes = [
  // Row 1 — Core
  { value: 'behavioral', label: 'Behavioral', icon: MessageSquare, desc: 'STAR method, leadership, teamwork', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'dsa', label: 'DSA', icon: Code2, desc: 'Data structures & algorithms', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { value: 'system-design', label: 'System Design', icon: Layers, desc: 'Architecture & scalability', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { value: 'technical', label: 'Technical', icon: Terminal, desc: 'General CS concepts', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  // Row 2 — Languages
  { value: 'javascript', label: 'JavaScript', icon: FileCode, desc: 'JS fundamentals & advanced', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { value: 'python', label: 'Python', icon: Coffee, desc: 'Python concepts & patterns', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { value: 'react', label: 'React', icon: Atom, desc: 'Hooks, state, performance', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
  { value: 'nodejs', label: 'Node.js', icon: Server, desc: 'Event loop, Express, async', color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/30' },
  // Row 3 — Domains
  { value: 'frontend', label: 'Frontend', icon: Globe, desc: 'HTML, CSS, browser APIs', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { value: 'backend', label: 'Backend', icon: Server, desc: 'APIs, auth, security', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { value: 'devops', label: 'DevOps', icon: Container, desc: 'Docker, CI/CD, cloud', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { value: 'database', label: 'Database', icon: Database, desc: 'SQL, NoSQL, ACID, indexing', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  // Mixed
  { value: 'mixed', label: 'Mixed', icon: Brain, desc: 'All topics combined', color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/30' },
];

const difficulties = [
  { value: 'easy', label: 'Easy', desc: 'Foundational concepts', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', desc: 'Industry standard', color: 'text-yellow-400' },
  { value: 'hard', label: 'Hard', desc: 'Senior level', color: 'text-red-400' },
];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    type: 'dsa',
    difficulty: 'medium',
    questionsCount: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await interviewAPI.start(config);
      const { interview, questions } = res.data;
      sessionStorage.setItem(`interview_${interview._id}`, JSON.stringify(questions));
      navigate(`/interview/${interview._id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeStart = async () => {
    setError('');
    setLoading(true);
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
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to start challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selected = interviewTypes.find(t => t.value === config.type);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Setup Your Interview</h1>
        <p className="text-gray-400 mt-1">Choose a topic, difficulty, and number of questions</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Interview Type */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Topic <span className="text-primary-400 normal-case font-normal ml-1">— {interviewTypes.find(t => t.value === config.type)?.label}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {interviewTypes.map(({ value, label, icon: Icon, desc, color, bg, border }) => (
            <button
              key={value}
              onClick={() => setConfig({ ...config, type: value })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                config.type === value
                  ? `${bg} ${border} border`
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center mb-2.5`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <div className="font-medium text-white text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Difficulty</h2>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map(({ value, label, desc, color }) => (
            <button
              key={value}
              onClick={() => setConfig({ ...config, difficulty: value })}
              className={`p-4 rounded-xl border text-center transition-all ${
                config.difficulty === value
                  ? 'bg-gray-800 border-primary-500/50'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`text-lg font-bold ${color} mb-1`}>{label}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Questions count */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Number of Questions: <span className="text-primary-400">{config.questionsCount}</span>
        </h2>
        <input
          type="range" min={5} max={20} step={1}
          value={config.questionsCount}
          onChange={(e) => setConfig({ ...config, questionsCount: Number(e.target.value) })}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>5 (Quick)</span>
          <span>10 (Standard)</span>
          <span>20 (Full)</span>
        </div>
      </div>

      {/* Summary */}
      <div className="card mb-6 bg-gray-800/50">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Session Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`font-semibold ${selected?.color || 'text-white'}`}>{selected?.label}</div>
            <div className="text-xs text-gray-500">Topic</div>
          </div>
          <div>
            <div className="text-white font-semibold capitalize">{config.difficulty}</div>
            <div className="text-xs text-gray-500">Difficulty</div>
          </div>
          <div>
            <div className="text-white font-semibold">{config.questionsCount}</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Setting up interview...</>
        ) : (
          <>Start Interview <ChevronRight size={18} /></>
        )}
      </button>

      {/* Challenge Mode */}
      <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-orange-400" />
              <span className="font-semibold text-white text-sm">Challenge Mode</span>
            </div>
            <p className="text-xs text-gray-400">Answer as many questions as possible in 60 seconds!</p>
          </div>
          <button
            onClick={handleChallengeStart}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-xl text-sm font-medium transition-all"
          >
            <Zap size={14} />
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
