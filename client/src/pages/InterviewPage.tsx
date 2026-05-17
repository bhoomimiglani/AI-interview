import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Question, CompleteInterviewResult } from '../types';
import { ChevronRight, Clock, Loader2, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';

interface MCQFeedback {
  isCorrect: boolean;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  correctOptionText: string;
  explanation: string;
}

interface LocationState {
  isChallenge?: boolean;
}

const CHALLENGE_DURATION = 60; // seconds

export default function InterviewPage() {
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) ?? {};
  const isChallenge = locationState.isChallenge ?? false;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<MCQFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(CHALLENGE_DURATION);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [interviewStartTime] = useState<number>(Date.now());
  const [error, setError] = useState('');
  const [challengeEnded, setChallengeEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const challengeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`interview_${interviewId}`);
    if (stored) {
      const qs = JSON.parse(stored) as Question[];
      setQuestions(qs);
      setTimeLeft(qs[0]?.timeLimit || 30);
      setStartTime(Date.now());
    } else {
      navigate('/interview/setup');
    }
  }, [interviewId, navigate]);

  // Challenge mode global timer
  useEffect(() => {
    if (!isChallenge || challengeEnded) return;
    challengeTimerRef.current = setInterval(() => {
      setChallengeTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(challengeTimerRef.current!);
          setChallengeEnded(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
    };
  }, [isChallenge]);

  // Auto-complete when challenge ends
  useEffect(() => {
    if (challengeEnded) {
      handleCompleteInterview();
    }
  }, [challengeEnded]);

  // Per-question countdown timer (non-challenge mode)
  useEffect(() => {
    if (isChallenge) return;
    if (feedback) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, feedback, isChallenge]);

  const currentQuestion = questions[currentIdx];

  const handleAutoSubmit = async () => {
    if (feedback) return;
    if (timerRef.current) clearInterval(timerRef.current);
    await submitAnswer(selectedOption ?? -1);
  };

  const submitAnswer = async (optionIndex: number) => {
    if (!interviewId || !currentQuestion || loading) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    setError('');
    try {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const res = await interviewAPI.submitAnswer(interviewId, {
        questionId: currentQuestion._id,
        questionText: currentQuestion.text,
        selectedOptionIndex: optionIndex,
        timeTaken,
      });
      setFeedback(res.data);

      if (isChallenge) {
        setTimeout(() => {
          advanceQuestion();
        }, 800);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    submitAnswer(selectedOption);
  };

  const advanceQuestion = () => {
    const isLast = currentIdx === questions.length - 1;
    if (isLast) {
      handleCompleteInterview();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(questions[currentIdx + 1]?.timeLimit || 30);
      setStartTime(Date.now());
    }
  };

  const handleCompleteInterview = async () => {
    if (!interviewId) return;
    setLoading(true);
    try {
      const duration = Math.round((Date.now() - interviewStartTime) / 1000);
      const res = await interviewAPI.complete(interviewId, duration);
      const result = res.data as CompleteInterviewResult;
      sessionStorage.removeItem(`interview_${interviewId}`);
      navigate(`/interview/${interviewId}/results`, {
        state: {
          newBadges: result.newBadges,
          streak: result.streak,
          dailyGoalReached: result.dailyGoalReached,
          questionsAnsweredToday: result.questionsAnsweredToday,
          dailyGoal: result.dailyGoal,
        },
      });
    } catch {
      navigate(`/interview/${interviewId}/results`);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    advanceQuestion();
  };

  if (!currentQuestion)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );

  const timerColor =
    timeLeft <= 10 ? 'text-red-600' : timeLeft <= 20 ? 'text-amber-600' : 'text-slate-500';
  const challengeColor =
    challengeTimeLeft <= 15
      ? 'text-red-600'
      : challengeTimeLeft <= 30
      ? 'text-amber-600'
      : 'text-green-600';

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Challenge mode banner */}
      {isChallenge && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">Challenge Mode</span>
            <span className="text-xs text-slate-500">— Answer as many as possible!</span>
          </div>
          <div className={`font-mono font-bold text-lg ${challengeColor}`}>
            {challengeTimeLeft}s
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="capitalize badge bg-slate-100 text-slate-600">
              {currentQuestion.type}
            </span>
            {!feedback && !isChallenge && (
              <div className={`flex items-center gap-1 font-mono font-bold ${timerColor}`}>
                <Clock size={13} />
                {timeLeft}s
              </div>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Question */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`badge ${
              currentQuestion.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : currentQuestion.difficulty === 'medium'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {currentQuestion.difficulty}
          </span>
          <span className="badge bg-slate-100 text-slate-600">{currentQuestion.category}</span>
        </div>
        <p className="text-slate-900 text-lg leading-relaxed font-medium">{currentQuestion.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          let style =
            'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer';

          if (feedback) {
            if (idx === feedback.correctOptionIndex) {
              style = 'bg-green-50 border-green-400 cursor-default';
            } else if (idx === feedback.selectedOptionIndex && !feedback.isCorrect) {
              style = 'bg-red-50 border-red-400 cursor-default';
            } else {
              style = 'bg-white border-slate-200 opacity-50 cursor-default';
            }
          } else if (selectedOption === idx) {
            style = 'bg-indigo-50 border-indigo-400 cursor-pointer';
          }

          return (
            <button
              key={idx}
              onClick={() => !feedback && setSelectedOption(idx)}
              disabled={!!feedback}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  feedback
                    ? idx === feedback.correctOptionIndex
                      ? 'bg-green-500 text-white'
                      : idx === feedback.selectedOptionIndex && !feedback.isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                    : selectedOption === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              <span
                className={`text-sm flex-1 ${
                  feedback
                    ? idx === feedback.correctOptionIndex
                      ? 'text-green-700 font-medium'
                      : idx === feedback.selectedOptionIndex && !feedback.isCorrect
                      ? 'text-red-700'
                      : 'text-slate-400'
                    : selectedOption === idx
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-700'
                }`}
              >
                {option.text}
              </span>

              {feedback && idx === feedback.correctOptionIndex && (
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              )}
              {feedback && idx === feedback.selectedOptionIndex && !feedback.isCorrect && (
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback explanation (non-challenge) */}
      {feedback && !isChallenge && (
        <div
          className={`card mb-4 border ${
            feedback.isCorrect
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {feedback.isCorrect ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <XCircle size={18} className="text-red-600" />
            )}
            <span
              className={`font-semibold ${
                feedback.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          {!feedback.isCorrect && (
            <p className="text-sm text-slate-600 mb-2">
              Correct answer:{' '}
              <span className="text-green-700 font-medium">{feedback.correctOptionText}</span>
            </p>
          )}
          <p className="text-sm text-slate-700 leading-relaxed">{feedback.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      {!isChallenge && (
        <>
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {currentIdx === questions.length - 1 ? 'View Results' : 'Next Question'}
              <ChevronRight size={16} />
            </button>
          )}
        </>
      )}

      {/* Challenge mode: just submit, auto-advance */}
      {isChallenge && !feedback && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          <Zap size={16} />
          Submit
        </button>
      )}
    </div>
  );
}
