import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Interview } from '../types';
import { Mic, Clock, ChevronRight, Loader2, Filter } from 'lucide-react';

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
    if (!s) return 'text-slate-400';
    return s >= 70 ? 'text-green-600' : s >= 50 ? 'text-amber-600' : 'text-red-600';
  };

  const typeColors: Record<string, string> = {
    behavioral: 'bg-blue-100 text-blue-700',
    dsa: 'bg-green-100 text-green-700',
    'system-design': 'bg-purple-100 text-purple-700',
    mixed: 'bg-indigo-100 text-indigo-700',
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
          <h1 className="text-2xl font-bold text-slate-900">Interview History</h1>
          <p className="text-slate-500 mt-1">Review your past sessions and feedback</p>
        </div>
        <Link to="/interview/setup" className="btn-primary flex items-center gap-2 text-sm">
          <Mic size={14} />
          New Interview
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter size={14} />
          Filter:
        </div>
        {['', 'completed', 'in-progress', 'abandoned'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter({ ...filter, status: s }); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter.status === s
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="card text-center py-12">
          <Mic size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 mb-4">No interviews found</p>
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
              className="card hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mic size={16} className="text-indigo-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-xs ${typeColors[interview.type] || 'bg-slate-100 text-slate-600'}`}>
                    {interview.type}
                  </span>
                  <span className={`badge text-xs ${
                    interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                    interview.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-medium truncate">{interview.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
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
                    <div className="text-xs text-slate-400">score</div>
                  </div>
                )}
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
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
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
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
