import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, BarChart3, MessageSquare, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Mic, title: 'Voice Input', desc: 'Answer questions naturally using your voice. Powered by OpenAI Whisper for accurate transcription.' },
  { icon: Brain, title: 'AI Feedback', desc: 'Get instant, detailed feedback on every answer with scores for communication, technical depth, and confidence.' },
  { icon: MessageSquare, title: 'Behavioral + DSA', desc: 'Practice STAR-method behavioral questions and data structures & algorithms in one platform.' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track your progress over time with detailed charts, skill breakdowns, and improvement insights.' },
  { icon: Zap, title: 'Mock Interviews', desc: 'Simulate real interview conditions with timed questions and adaptive difficulty levels.' },
  { icon: Shield, title: 'System Design', desc: 'Practice system design questions with AI-guided evaluation of your architecture decisions.' },
];

const stats = [
  { value: '10K+', label: 'Interviews Completed' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '3x', label: 'Faster Preparation' },
  { value: '500+', label: 'Questions Bank' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Nav */}
      <nav className="border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10 bg-white/90">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={18} />
            </div>
            <span className="font-bold text-slate-900">AI Interview Prep</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-sm text-indigo-600 mb-6">
          <Zap size={14} />
          Powered by GPT-4 &amp; Whisper AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Ace Your Next Interview<br />
          <span className="gradient-text">With AI Coaching</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Practice mock interviews with voice input, get instant AI feedback, and track your performance with detailed analytics. Built for 2026 job seekers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-8">
            Start Practicing Free
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base py-3 px-8">
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-200">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Prepare</h2>
          <p className="text-slate-500 max-w-xl mx-auto">A complete interview preparation toolkit powered by the latest AI technology.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Choose Your Interview', desc: 'Select interview type (behavioral, DSA, system design), difficulty, and number of questions.' },
            { step: '02', title: 'Answer with Voice or Text', desc: 'Respond naturally using your microphone or type your answers. AI transcribes voice in real-time.' },
            { step: '03', title: 'Get AI Feedback', desc: 'Receive instant detailed feedback with scores, strengths, improvements, and key points analysis.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="text-5xl font-bold text-indigo-200 mb-4">{step}</div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Join thousands of developers who improved their interview skills with AI-powered practice.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {['No credit card required', 'Free to start', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-indigo-100">
                <CheckCircle size={14} className="text-white" />
                {item}
              </div>
            ))}
          </div>
          <Link to="/register" className="inline-flex items-center gap-2 text-base py-3 px-8 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        <p>© 2026 AI Interview Prep Platform. Built with React, Node.js, MongoDB &amp; OpenAI.</p>
      </footer>
    </div>
  );
}
