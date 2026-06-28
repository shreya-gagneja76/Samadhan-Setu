import React, { useState, useEffect } from 'react';
import { TabName, Issue } from '../types';
import { Bot, Map, Users, Clock, Flame, ChevronRight, MapPin } from 'lucide-react';

interface HomeTabProps {
  setActiveTab: (tab: TabName) => void;
  issues: Issue[];
}

function AnimatedCounter({ endValue, duration = 1500 }: { endValue: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = endValue;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function HomeTab({ setActiveTab, issues }: HomeTabProps) {
  // Compute metrics dynamically from the live issue stream of our simulated district (Ward 14)
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
  const reportedCount = issues.length;
  const citizenCount = issues.reduce((acc, current) => acc + (current.upvotes || 0), 0) + (issues.length * 3);

  return (
    <div className="animate-fadeIn space-y-12 pb-16">
      {/* Full-width Hero Section with Navy-to-Saffron Gradient */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B3A6B] via-[#1E4D8A] to-[#FF6B35] text-white p-8 md:p-16 shadow-xl">
        {/* Subtle geometric circles background */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-semibold uppercase tracking-wider text-orange-200">
            <Flame size={12} className="animate-pulse text-[#FF6B35]" />
            AI-Powered Municipal Bridge
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Your City. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-400">Your Voice.</span> <br />
            Your Power.
          </h1>
          <p className="text-lg md:text-xl text-slate-100 max-w-xl font-medium leading-relaxed">
            Report civic issues in seconds with AI. Snap it, map it, and watch municipal authorities resolve it. Bridging citizens to solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              id="hero-cta-report"
              onClick={() => setActiveTab('Report Issue')}
              className="px-8 py-4 bg-[#FF6B35] hover:bg-orange-600 active:scale-95 transition-all text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 text-md focus:outline-none"
            >
              Report an Issue <ChevronRight size={18} />
            </button>
            <button
              id="hero-cta-feed"
              onClick={() => setActiveTab('Issues Feed')}
              className="px-8 py-4 bg-transparent border-2 border-white/80 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center text-md focus:outline-none"
            >
              View Issues Feed
            </button>
          </div>
        </div>
      </section>

      {/* Animated Counter Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border-b-4 border-orange-500 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-4 rounded-full bg-orange-50 dark:bg-orange-950/20 text-[#FF6B35] mb-4">
            <Bot size={28} />
          </div>
          <h3 className="text-3xl font-extrabold text-[#1B3A6B] dark:text-blue-400">
            <AnimatedCounter endValue={reportedCount} />
          </h3>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Ward 14 Issues Reported</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border-b-4 border-green-500 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-4 rounded-full bg-green-50 dark:bg-green-950/20 text-green-500 mb-4">
            <Clock size={28} />
          </div>
          <h3 className="text-3xl font-extrabold text-[#1B3A6B] dark:text-blue-400">
            <AnimatedCounter endValue={resolvedCount} />
          </h3>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Ward 14 Issues Resolved</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border-b-4 border-blue-500 flex flex-col items-center text-center group cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-500 mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-3xl font-extrabold text-[#1B3A6B] dark:text-blue-400">
            <AnimatedCounter endValue={citizenCount} />
          </h3>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Ward 14 Endorsements & Citizens</p>
        </div>
      </section>

      {/* Feature Highlight Cards Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3.5xl font-black text-[#1B3A6B] dark:text-white">
            Smart Features built with Citizens in Mind
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            Samadhan Setu unites advanced artificial intelligence with community verification to patch infrastructure gaps instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm transition-all hover:scale-102 hover:shadow-md flex flex-col h-full">
            <div className="mb-3 text-[#FF6B35]"><Bot size={28} /></div>
            <h4 className="text-lg font-bold text-[#1B3A6B] dark:text-blue-400">AI Analysis</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow leading-relaxed font-semibold">
              Instant image recognition categorization, severity tagging, and urgency scoring automatically handled by Gemini 2.5 Flash Vision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm transition-all hover:scale-102 hover:shadow-md flex flex-col h-full">
            <div className="mb-3 text-[#FF6B35]"><Map size={28} /></div>
            <h4 className="text-lg font-bold text-[#1B3A6B] dark:text-blue-400">Live Map</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow leading-relaxed font-semibold">
              Pinpoint precise geographical location tags utilizing native browser Geolocation APIs to discover nearby challenges.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm transition-all hover:scale-102 hover:shadow-md flex flex-col h-full">
            <div className="mb-3 text-[#FF6B35]"><Users size={28} /></div>
            <h4 className="text-lg font-bold text-[#1B3A6B] dark:text-blue-400">Community Verify</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow leading-relaxed font-semibold">
              Crowdsourced upvotes validate issues and qualify them automatically for state funding once verified by fellow citizens.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm transition-all hover:scale-102 hover:shadow-md flex flex-col h-full">
            <div className="mb-3 text-[#FF6B35]"><MapPin size={28} /></div>
            <h4 className="text-lg font-bold text-[#1B3A6B] dark:text-blue-400">Track Progress</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow leading-relaxed font-semibold">
              Monitor transparent real-time resolution status and utilize our advanced Image-Comparison AI engine to check completed tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Inspirational call-out footer banner */}
      <section className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="max-w-md">
          <h3 className="text-lg font-extrabold text-[#1B3A6B] dark:text-orange-300">Be a Municipal Hero of Your Ward</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Contribute to clean, well-lit, smooth street lanes. Earn karma points, unlock badges, and compete on the civic leaderboards.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('Report Issue')}
          className="px-6 py-3 bg-[#FF6B35] font-bold text-white rounded-lg hover:bg-orange-600 transition-all shadow-md focus:outline-none flex-shrink-0 cursor-pointer text-xs"
        >
          Start Your First Report
        </button>
      </section>
    </div>
  );
}
