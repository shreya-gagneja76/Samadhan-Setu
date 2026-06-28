/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TabName, Issue, UserProfile, ToastMessage } from './types';
import { getInitialIssues } from './initialIssues';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import ReportTab from './components/ReportTab';
import FeedTab from './components/FeedTab';
import MapTab from './components/MapTab';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import AuthTab from './components/AuthTab';
import ChatbotWidget from './components/ChatbotWidget';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const initialIssues = getInitialIssues();

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem('samadhan_issues');
      return saved ? JSON.parse(saved) : initialIssues;
    } catch {
      return initialIssues;
    }
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastQueue, setToastQueue] = useState<ToastMessage[]>([]);
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  // Cycle bottom ticker index through the last 5 issues
  const tickerIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [issues]);

  useEffect(() => {
    if (tickerIssues.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerIssues.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerIssues.length]);

  // 1. Initialize localStorage state on Boot
  useEffect(() => {
    // Check theme preference
    const savedTheme = localStorage.getItem('samadhan_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load Profile and Active Session
    const savedEmail = localStorage.getItem('samadhan_current_email');
    const savedProfile = localStorage.getItem('samadhan_profile');
    
    if (savedEmail && savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
        setSessionEmail(savedEmail);
      } catch (e) {
        setProfile(null);
        setSessionEmail(null);
      }
    } else {
      setProfile(null);
      setSessionEmail(null);
    }
  }, []);

  // Save issues to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('samadhan_issues', JSON.stringify(issues));
    } catch {}
  }, [issues]);

  const resetToSeedData = () => {
    localStorage.removeItem('samadhan_issues');
    setIssues(initialIssues);
    showToast('info', 'Demo data reset to seed issues.');
  };

  // 2. Synchronize Dark Mode Class changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('samadhan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('samadhan_theme', 'light');
    }
  }, [darkMode]);

  // 3. Global Toast Handlers
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, text };
    
    setToastQueue((prev) => [...prev, newToast]);

    // Self-dismiss after 3 seconds
    setTimeout(() => {
      setToastQueue((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  const handleLoginSuccess = (userProfile: UserProfile, email: string) => {
    setProfile(userProfile);
    setSessionEmail(email);
    localStorage.setItem('samadhan_profile', JSON.stringify(userProfile));
    localStorage.setItem('samadhan_current_email', email);
    setActiveTab('Home');
  };

  const handleLogout = () => {
    setProfile(null);
    setSessionEmail(null);
    localStorage.removeItem('samadhan_profile');
    localStorage.removeItem('samadhan_current_email');
    setActiveTab('Home');
    showToast('info', 'Logged out successfully. Secure citizen ward session closed.');
  };

  // 4. State updates handlers
  const addNewIssue = (newIssueOmit: Omit<Issue, 'id' | 'timestamp' | 'upvotes' | 'status'>) => {
    const freshId = `issue-${Math.random().toString(36).substring(2, 9)}`;
    const freshIssue: Issue = {
      ...newIssueOmit,
      id: freshId,
      timestamp: Date.now(),
      upvotes: 0,
      status: 'Open',
    };

    const updatedIssues = [freshIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('samadhan_issues', JSON.stringify(updatedIssues));

    // Award +10 points to profile
    if (profile && profile.role !== 'inspector') {
      const updatedProfile: UserProfile = {
        ...profile,
        points: profile.points + 10,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Filed civic issue report: ${freshIssue.title}`,
            points: 10,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    } else if (profile && profile.role === 'inspector') {
      const updatedProfile: UserProfile = {
        ...profile,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Filed official ward report: ${freshIssue.title}`,
            points: 0,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    }
  };

  const upvoteIssue = (id: string) => {
    // Prevent duplicate upvotes
    const alreadyUpvoted = issues.find(i => i.id === id)?.upvotedByMe;
    if (alreadyUpvoted) {
      showToast('warning', 'You have already upvoted/endorsed this issue!');
      return;
    }

    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        return {
          ...issue,
          upvotes: issue.upvotes + 1,
          upvotedByMe: true
        };
      }
      return issue;
    });

    setIssues(updatedIssues);
    localStorage.setItem('samadhan_issues', JSON.stringify(updatedIssues));

    // Award +2 verification points to profile
    if (profile && profile.role !== 'inspector') {
      const targetIssue = issues.find(i => i.id === id);
      const updatedProfile: UserProfile = {
        ...profile,
        points: profile.points + 2,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Upvoted verification for: ${targetIssue?.title || 'Civic report'}`,
            points: 2,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    } else if (profile && profile.role === 'inspector') {
      const targetIssue = issues.find(i => i.id === id);
      const updatedProfile: UserProfile = {
        ...profile,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Endorsed citizen verification for: ${targetIssue?.title || 'Civic report'}`,
            points: 0,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    }
  };

  const verifyResolution = (
    id: string, 
    afterImage: string, 
    result: { resolved: boolean; confidence: number; reason: string }
  ) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        return {
          ...issue,
          afterImage,
          verificationResult: result,
          status: result.resolved ? ('Resolved' as const) : issue.status
        };
      }
      return issue;
    });

    setIssues(updatedIssues);
    localStorage.setItem('samadhan_issues', JSON.stringify(updatedIssues));

    // If verified successfully, award +15 verification points
    if (profile && result.resolved && profile.role !== 'inspector') {
      const targetIssue = issues.find(i => i.id === id);
      const updatedProfile: UserProfile = {
        ...profile,
        points: profile.points + 15,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Verified resolution audit for: ${targetIssue?.title || 'Reported lane'}`,
            points: 15,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    } else if (profile && result.resolved && profile.role === 'inspector') {
      const targetIssue = issues.find(i => i.id === id);
      const updatedProfile: UserProfile = {
        ...profile,
        actions: [
          {
            id: `act-${Math.random().toString(36).substring(2, 9)}`,
            description: `Officially signed off resolution audit for: ${targetIssue?.title || 'Reported lane'}`,
            points: 0,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    }
  };

  const updateIssueStatus = (id: string, status: 'Open' | 'In Progress' | 'Resolved', notes?: string) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        return {
          ...issue,
          status,
          notes: notes !== undefined ? notes : issue.notes
        };
      }
      return issue;
    });

    setIssues(updatedIssues);
    localStorage.setItem('samadhan_issues', JSON.stringify(updatedIssues));

    // Award / Log action in inspector profile if logged in
    if (profile && profile.role === 'inspector') {
      const targetIssue = issues.find(i => i.id === id);
      const isStatusChange = targetIssue?.status !== status;
      
      const updatedProfile: UserProfile = {
        ...profile,
        actions: [
          {
            id: `act-audit-${Math.random().toString(36).substring(2, 9)}`,
            description: isStatusChange 
              ? `Officially updated "${targetIssue?.title || 'Complaint'}" status to "${status}"`
              : `Logged supervisor notes on "${targetIssue?.title || 'Complaint'}"`,
            points: 0,
            timestamp: Date.now()
          },
          ...profile.actions
        ]
      };
      setProfile(updatedProfile);
      localStorage.setItem('samadhan_profile', JSON.stringify(updatedProfile));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Sticky Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        isAuthenticated={!!sessionEmail}
        onLogout={handleLogout}
        profile={profile}
      />

      {/* Main View Port router container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!sessionEmail ? (
          <AuthTab onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        ) : (
          <>
            {activeTab === 'Home' && (
              <HomeTab setActiveTab={setActiveTab} issues={issues} />
            )}
            
            {activeTab === 'Report Issue' && (
              <ReportTab 
                setActiveTab={setActiveTab} 
                issues={issues} 
                addNewIssue={addNewIssue} 
                showToast={showToast} 
                profile={profile}
              />
            )}
            
            {activeTab === 'Issues Feed' && (
              <FeedTab 
                setActiveTab={setActiveTab} 
                issues={issues} 
                upvoteIssue={upvoteIssue} 
                verifyResolution={verifyResolution}
                showToast={showToast} 
                profile={profile}
                updateIssueStatus={updateIssueStatus}
              />
            )}
            
            {activeTab === 'Map View' && (
              <MapTab 
                setActiveTab={setActiveTab} 
                issues={issues} 
                profile={profile}
                upvoteIssue={upvoteIssue}
                updateIssueStatus={updateIssueStatus}
                verifyResolution={verifyResolution}
                showToast={showToast}
              />
            )}
            
            {activeTab === 'Dashboard' && (
              <DashboardTab setActiveTab={setActiveTab} issues={issues} profile={profile} />
            )}
            
            {activeTab === 'Profile' && profile && (
              <ProfileTab profile={profile} issues={issues} />
            )}
          </>
        )}
      </main>

      {!!sessionEmail && (
        <ChatbotWidget issues={issues} profile={profile} />
      )}

      {/* Floating Toast Notification Deck */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toastQueue.map((toast) => {
          let bgClass = 'bg-white dark:bg-slate-800 border-l-4 border-slate-400';
          let textColor = 'text-slate-600 dark:text-slate-200';
          let Icon = Info;

          if (toast.type === 'success') {
            bgClass = 'bg-green-50 dark:bg-green-950/90 border-l-4 border-green-500';
            textColor = 'text-green-800 dark:text-green-200';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            bgClass = 'bg-red-50 dark:bg-red-950/90 border-l-4 border-red-500';
            textColor = 'text-red-800 dark:text-red-200';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-50 dark:bg-amber-950/90 border-l-4 border-amber-500';
            textColor = 'text-amber-800 dark:text-amber-200';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={toast.id}
              className={`p-4 rounded-xl shadow-xl flex items-start gap-3 pointer-events-auto border border-black/5 animate-slideIn ${bgClass}`}
            >
              <span className={`flex-shrink-0 mt-0.5 ${textColor}`}>
                <Icon size={16} />
              </span>
              <p className={`text-xs font-bold leading-relaxed ${textColor}`}>{toast.text}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Points/Activity Ticker */}
      <div className="bg-[#1B3A6B] text-white px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-bold border-t border-blue-900/40">
        <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center text-center">
          <span className="flex items-center gap-1.5">
            <span className="text-[#FF6B35] text-sm">🏆</span> CIVIC LEGEND RANK IN REACH
          </span>
          <span className="hidden md:inline text-white/20 font-normal">|</span>
          <span className="animate-pulse text-[#FF6B35]">LIVE TICKER:</span>
          {tickerIssues.length > 0 ? (
            <span key={tickerIndex} className="font-medium italic text-slate-100 transition-all duration-300">
              [{tickerIssues[tickerIndex].status}] "{tickerIssues[tickerIndex].title}" reported at {tickerIssues[tickerIndex].location} ({tickerIssues[tickerIndex].department} Department)
            </span>
          ) : (
            <span className="font-medium italic text-slate-100">No active civic issues reported yet. Be the first!</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#FF6B35] px-2 py-0.5 rounded text-[9px] text-white font-black uppercase tracking-wider shadow-sm">EARN +10 POINTS</span>
          <span className="text-[11px] tracking-tight uppercase">Report challenges today</span>
        </div>
      </div>

      {/* Footer Branding credits */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-850 py-6 text-center text-xs font-semibold text-gray-400 dark:text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-1.5">
          <p>© {new Date().getFullYear()} Samadhan Setu — Bridging Citizens to Solutions. Government of India - Civic Empowerment System.</p>
          <p className="text-[10px] text-gray-300 dark:text-slate-600">Built with Gemini 2.5 Flash Vision. Keeping our wards pristine.</p>
          <button
            onClick={resetToSeedData}
            className="mt-1 px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
          >
            Reset Demo Data 🔄
          </button>
        </div>
      </footer>
    </div>
  );
}
