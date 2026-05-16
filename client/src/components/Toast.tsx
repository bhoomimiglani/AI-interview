import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Trophy, Flame, Star } from 'lucide-react';

export type ToastType = 'badge' | 'streak' | 'perfect' | 'goal' | 'success' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  emoji?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  badge: <Trophy size={18} className="text-yellow-400" />,
  streak: <Flame size={18} className="text-orange-400" />,
  perfect: <Star size={18} className="text-yellow-400" />,
  goal: <CheckCircle size={18} className="text-green-400" />,
  success: <CheckCircle size={18} className="text-green-400" />,
  info: <CheckCircle size={18} className="text-blue-400" />,
};

const bgMap: Record<ToastType, string> = {
  badge: 'bg-yellow-500/10 border-yellow-500/30',
  streak: 'bg-orange-500/10 border-orange-500/30',
  perfect: 'bg-yellow-500/10 border-yellow-500/30',
  goal: 'bg-green-500/10 border-green-500/30',
  success: 'bg-green-500/10 border-green-500/30',
  info: 'bg-blue-500/10 border-blue-500/30',
};

function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto dismiss after 4s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full
        transition-all duration-300
        ${bgMap[toast.type]}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {toast.emoji && <span className="text-base">{toast.emoji}</span>}
          <p className="text-sm font-semibold text-white">{toast.title}</p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
