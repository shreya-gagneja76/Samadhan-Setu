import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, User, Mail, Lock, Building2, ChevronRight, UserPlus, LogIn, ArrowRight, Info } from 'lucide-react';

interface AuthTabProps {
  onLoginSuccess: (profile: UserProfile, email: string) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', text: string) => void;
}

export default function AuthTab({ onLoginSuccess, showToast }: AuthTabProps) {
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupWard, setSignupWard] = useState('Ward 45 - Nehru Nagar');
  const [signupRole, setSignupRole] = useState<'citizen' | 'inspector'>('citizen');

  // Interactive quick access accounts
  const handleQuickLogin = (role: 'citizen' | 'officer') => {
    if (role === 'citizen') {
      const today = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const demoProfile: UserProfile = {
        name: 'Arjun Sharma',
        points: 210,
        joinDate: today,
        role: 'citizen',
        actions: [
          {
            id: 'act-demo-1',
            description: 'Profile Registration bonus credited',
            points: 50,
            timestamp: Date.now() - 5 * 24 * 3600000,
          },
          {
            id: 'act-demo-2',
            description: 'Verified a major water leak issue',
            points: 15,
            timestamp: Date.now() - 3 * 24 * 3600000,
          },
          {
            id: 'act-demo-3',
            description: 'Received community upvotes reward',
            points: 145,
            timestamp: Date.now() - 1 * 24 * 365000,
          }
        ]
      };
      onLoginSuccess(demoProfile, 'arjun@samadhan.gov.in');
      showToast('success', 'Logged in as Arjun Sharma (Active Citizen) successfully');
    } else {
      const today = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const officerProfile: UserProfile = {
        name: 'Inspector Rajesh Kumar',
        points: 480,
        joinDate: today,
        role: 'inspector',
        actions: [
          {
            id: 'act-off-1',
            description: 'Sub-divisional Inspector clearance bonus',
            points: 100,
            timestamp: Date.now() - 10 * 24 * 3600000,
          },
          {
            id: 'act-off-2',
            description: 'Audited and verified 8 street potholes',
            points: 120,
            timestamp: Date.now() - 6 * 24 * 3600000,
          },
          {
            id: 'act-off-3',
            description: 'Garbage dump resolution verified',
            points: 260,
            timestamp: Date.now() - 2 * 24 * 3600000,
          }
        ]
      };
      onLoginSuccess(officerProfile, 'rajesh.kumar@corporation.gov.in');
      showToast('success', 'Logged in as Inspector Rajesh Kumar (Ward Commissioner) successfully');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('warning', 'Please specify both your email address and password credentials.');
      return;
    }

    // Check localStorage for registered credentials
    const localUsers = localStorage.getItem('samadhan_registered_users');
    let usersList = [];
    if (localUsers) {
      try {
        usersList = JSON.parse(localUsers);
      } catch (err) {
        usersList = [];
      }
    }

    const matchedUser = usersList.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase());

    if (matchedUser) {
      if (matchedUser.password === loginPassword) {
        const today = new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const customProfile: UserProfile = {
          name: matchedUser.name,
          points: matchedUser.points || 10,
          joinDate: matchedUser.joinDate || today,
          role: matchedUser.role || (matchedUser.email.includes('inspector') || matchedUser.email.endsWith('.gov.in') ? 'inspector' : 'citizen'),
          actions: matchedUser.actions || [
            {
              id: 'act-reg-init',
              description: 'Profile Account Activation bonus credited',
              points: 10,
              timestamp: Date.now(),
            }
          ]
        };
        onLoginSuccess(customProfile, matchedUser.email);
        showToast('success', `Welcome back, ${matchedUser.name}!`);
      } else {
        showToast('error', 'Authentication failed. Please verify your password and try again.');
      }
    } else {
      // Allow seamless fallback for any demo entry (perfect offline working model!)
      const today = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const isInsp = loginEmail.includes('inspector') || loginEmail.includes('officer') || loginEmail.endsWith('.gov.in');
      const mockProfile: UserProfile = {
        name: loginEmail.split('@')[0].toUpperCase(),
        points: 40,
        joinDate: today,
        role: isInsp ? 'inspector' : 'citizen',
        actions: [{ id: 'act-mock-1', description: 'Instant demo credit reward', points: 40, timestamp: Date.now() }]
      };
      onLoginSuccess(mockProfile, loginEmail);
      showToast('success', `Seeded dynamic session for ${loginEmail} as ${isInsp ? 'Inspector' : 'Citizen'}`);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      showToast('warning', 'Please fill out all the mandatory fields to secure your local profile.');
      return;
    }

    // Capture user details to list
    const localUsers = localStorage.getItem('samadhan_registered_users');
    let usersList = [];
    if (localUsers) {
      try {
        usersList = JSON.parse(localUsers);
      } catch (err) {
        usersList = [];
      }
    }

    const emailExists = usersList.some((u: any) => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (emailExists) {
      showToast('warning', 'An account already exists under this email address. Proceed to login below.');
      setActiveMode('login');
      return;
    }

    const today = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      ward: signupWard,
      role: signupRole,
      points: signupRole === 'inspector' ? 100 : 50, // bonus for registration
      joinDate: today,
      actions: [
        {
          id: `act-signup-reg`,
          description: signupRole === 'inspector' 
            ? 'Earned Official Inspector welcome registration credentials' 
            : 'Earned Registration Citizen welcome bonus points',
          points: signupRole === 'inspector' ? 100 : 50,
          timestamp: Date.now()
        }
      ]
    };

    usersList.push(newUser);
    localStorage.setItem('samadhan_registered_users', JSON.stringify(usersList));

    // Sign in immediately
    const profileObj: UserProfile = {
      name: signupName,
      points: signupRole === 'inspector' ? 100 : 50,
      joinDate: today,
      role: signupRole,
      actions: newUser.actions
    };

    onLoginSuccess(profileObj, signupEmail);
    showToast('success', `Welcome to Samadhan Setu! Registered as ${signupRole === 'inspector' ? 'Inspector' : 'Citizen'} successfully.`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Brand Banner */}
        <div className="p-8 bg-gradient-to-r from-[#1B3A6B] to-[#FF6B35] text-white text-center relative">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-center mb-2">
            <ShieldCheck size={40} className="text-orange-200" />
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">Samadhan Setu Authentication</h2>
          <p className="text-xs text-slate-100/90 mt-1.5 font-medium">
            Access your civic ward dashboard & contribute verified street audits.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-100 dark:border-slate-700">
          <button
            onClick={() => setActiveMode('login')}
            className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider transition-all focus:outline-none ${
              activeMode === 'login'
                ? 'border-b-2 border-[#1B3A6B] text-[#1B3A6B] dark:text-blue-400 font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Sign In Account
          </button>
          <button
            onClick={() => setActiveMode('signup')}
            className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider transition-all focus:outline-none ${
              activeMode === 'signup'
                ? 'border-b-2 border-[#1B3A6B] text-[#1B3A6B] dark:text-blue-400 font-black'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Create Citizen Profile
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Demo Mode Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/45 border border-blue-100 dark:border-blue-900/60 text-[#1B3A6B] dark:text-blue-200 p-3.5 rounded-2xl flex gap-2.5 text-xs font-semibold leading-relaxed">
            <Info size={18} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              Demo mode — use any email & password to log in. For inspector access, use an email containing 'inspector' or ending in '.gov.in'
            </span>
          </div>

          {activeMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@government.gov.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B3A6B] hover:bg-[#FF6B35] text-white font-bold text-xs rounded-xl transition-all shadow-md focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn size={15} /> Authenticate Session
              </button>

              {/* Credentials tip for judges and reviewers */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-2 mt-4 text-[11px] text-slate-500 dark:text-slate-400 shadow-inner">
                <p className="font-extrabold text-[#1B3A6B] dark:text-blue-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                  <span>💡</span> Quick-Testing Credentials
                </p>
                <div className="space-y-1.5 text-left leading-relaxed font-semibold">
                  <p>
                    • To test as a <span className="font-bold text-[#FF6B35]">Citizen</span>: Enter any standard email (e.g., <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono text-[10px]">citizen@gmail.com</code>).
                  </p>
                  <p>
                    • To test as a <span className="font-bold text-[#FF6B35]">Municipal Inspector</span>: Enter an email containing the word <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono text-[10px]">inspector</code> or <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono text-[10px]">officer</code>, or ending in <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono text-[10px]">.gov.in</code> (e.g., <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono text-[10px]">officer@ward.gov.in</code>).
                  </p>
                </div>
                <p className="italic text-[10px] text-slate-400 pt-1 text-left border-t border-slate-100 dark:border-slate-800">
                  Note: Demo-mode auth only. Passwords are not hashed — for hackathon use only. A production deployment would use server-side auth with bcrypt or OAuth.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Sharma"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="arjun.civic@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Create secure password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Type / Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('citizen')}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                      signupRole === 'citizen'
                        ? 'border-[#FF6B35] bg-orange-50 dark:bg-orange-950/20 text-[#FF6B35]'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                    }`}
                  >
                    Citizen Representative
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('inspector')}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                      signupRole === 'inspector'
                        ? 'border-[#1B3A6B] dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20 text-[#1B3A6B] dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                    }`}
                  >
                    Official Inspector
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Municipal Ward Allocation</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Building2 size={16} />
                  </span>
                  <select
                    value={signupWard}
                    onChange={(e) => setSignupWard(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  >
                    <option value="Ward 45 - Nehru Nagar">Ward 45 - Nehru Nagar</option>
                    <option value="Ward 12 - Dwarka Crossing">Ward 12 - Dwarka Crossing</option>
                    <option value="Ward 82 - MG Road South">Ward 82 - MG Road South</option>
                    <option value="Ward 29 - Lajpat Block">Ward 29 - Lajpat Block</option>
                    <option value="Ward 97 - Yamuna Bypass">Ward 97 - Yamuna Bypass</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B35] hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus size={15} /> Create and Register Profile
              </button>
            </form>
          )}

          {/* Quick Demo Pre-seed Logins */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-450 block text-center">
              Instant Demo Inspection Accounts
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('citizen')}
                className="py-2.5 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-orange-50/20 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span className="text-slate-400">👤 Citizen Key</span>
                <span className="text-[10px] text-[#FF6B35]">Arjun Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('officer')}
                className="py-2.5 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50/20 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span className="text-slate-400">🏛 Inspector Key</span>
                <span className="text-[10px] text-[#1B3A6B] dark:text-blue-400">Rajesh Kumar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
