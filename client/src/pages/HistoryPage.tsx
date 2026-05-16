import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Interview } from '../types';
import { Mic, Clock, ChevronRight, Loader2, Filter, Trophy } from 'lucide-react';

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', type: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (filter.status) params.status = filter.status;
      const res = await interviewAPI.getAll(params);
      setInterviews(res.data.interviews);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInterviews(); }, [page, filter]);

  const scoreColor = (s?: number) => {
    if (!s) return 'text-gray-500';
    return s >= 70 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';
  };

  const typeColors: Record<string, string> = {
    behavioral: 'bg-blue-500/10 text-blue-400',
    dsa: 'bg-green-500/10 text-green-400',
    'system-design': 'bg-purple-500/10 text-purple-400',
    mixed: 'bg-primary-500/10 text-primary-400',
  };

  const formatDuration = (s: number) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    return `${m}m`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview History</h1>
          <p className="text-gray-400 mt-1">Review your past sessions and feedback</p>
        </div>
        <Link to="/interview/setup" className="btn-primary flex items-center gap-2 text-sm">
          <Mic size={14} />
          New Interview
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter size={14} />
          Filter:
        </div>
        {['', 'completed', 'in-progress', 'abandoned'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter({ ...filter, status: s }); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter.status === s
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="card text-center py-12">
          <Mic size={40} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-400 mb-4">No interviews found</p>
          <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2 text-sm">
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              to={interview.status === 'completed' ? `/interview/${interview._id}/results` : `/interview/${interview._id}`}
              className="card hover:border-gray-700 transition-all flex items-center gap-4 group"
            >
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mic size={16} className="text-primary-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-xs ${typeColors[interview.type] || 'bg-gray-800 text-gray-400'}`}>
                    {interview.type}
                  </span>
                  <span className={`badge text-xs ${
                    interview.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                    interview.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-gray-800 text-gray-500'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate">{interview.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatDuration(interview.duration)}
                  </span>
                  <span>{interview.answers.length}/{interview.questionsCount} questions</span>
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {interview.status === 'completed' && (
                  <div className="text-center">
                    <div className={`text-xl font-bold ${scoreColor(interview.overallScore)}`}>
                      {interview.overallScore || 0}
                    </div>
                    <div className="text-xs text-gray-600">score</div>
                  </div>
                )}
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
