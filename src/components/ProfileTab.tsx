import React from 'react';
import { UserProfile, Issue } from '../types';
import { Award, Lock, Shield, CheckCircle, Flame, Clock, Landmark, FileText, CheckCircle2, ShieldAlert, Activity, ClipboardList } from 'lucide-react';

interface ProfileTabProps {
  profile: UserProfile;
  issues: Issue[];
}

export default function ProfileTab({ profile, issues }: ProfileTabProps) {
  const points = profile.points;

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 0) return 'CH';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Professional Official Inspector View
  if (profile.role === 'inspector') {
    const totalAudited = issues.length;
    const resolvedAudits = issues.filter(i => i.status === 'Resolved').length;
    const activeBacklog = issues.filter(i => i.status !== 'Resolved').length;
    const clearanceRate = totalAudited > 0 ? Math.round((resolvedAudits / totalAudited) * 100) : 100;
    const sortedActions = [...profile.actions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    return (
      <div className="animate-fadeIn space-y-8 pb-16">
        {/* Official Header Card */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          {/* Subtle security mesh design */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Official Seal Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-800 border-4 border-blue-500/40 text-blue-400 font-black text-3.5xl flex flex-col items-center justify-center shadow-lg select-none flex-shrink-0 relative">
            <span className="text-2xl font-black">{getInitials(profile.name)}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">SECURE</span>
          </div>

          {/* Inspector Credentials */}
          <div className="space-y-4 flex-1 text-center md:text-left w-full z-10">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  {profile.name}
                  <span className="inline-flex items-center gap-1 text-[9px] bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase shadow-md animate-pulse">
                    🛡️ Verified Inspector
                  </span>
                </h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  OFFICIAL WARD INSPECTOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                DEPARTMENT OF CIVIC RESOLUTIONS & AUDITS
              </p>
            </div>

            {/* Official Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-left">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Officer ID</span>
                <span className="text-xs text-slate-300 font-mono font-bold">ISD-45-7762</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Ward Jurisdiction</span>
                <span className="text-xs text-slate-300 font-bold">Ward 45 (Central)</span>
              </div>
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Credentials Authorized</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Shield size={12} /> Active / Level-3
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Metrics Card Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Assigned Ward Backlog</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{activeBacklog}</h3>
            <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">Pending Audit Updates</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Completed Audits</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{resolvedAudits}</h3>
            <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Approved Resolutions</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Reports Handled</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{totalAudited}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Cumulative Tickets</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/80 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Clearance Efficiency</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{clearanceRate}%</h3>
            <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">Ward Audit Resolution Rate</p>
          </div>
        </section>

        {/* Split Section: Auditing Guidelines (Professional Duties) vs Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Professional Auditing Protocols */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark size={18} className="text-blue-500" />
              <span>Jurisdictional Auditing & Regulatory Protocols</span>
            </h4>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700/80 shadow-md space-y-5">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                As a designated Public Grievance Inspector, your actions are held to high administrative standards. Please execute status changes and verification logs in compliance with municipal regulations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200 uppercase">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>Evidence-Based Resolution</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Prior to moving any complaint to "Resolved", inspect physical coordinates and verify photo attachments filed by active citizen representatives.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200 uppercase">
                    <FileText size={14} className="text-blue-500" />
                    <span>Comprehensive Documentation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Provide detailed, structured notes on status logs. Clearly outline the engineering repairs or dispatch actions implemented.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2 col-span-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200 uppercase">
                    <ShieldAlert size={14} className="text-amber-500" />
                    <span>Accountability & Security Standards</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    All audits are cataloged under secure official signatures. Verified actions are final and visible to municipal commissioners and ward wardens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Audit Trail */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity size={18} className="text-orange-500" />
              <span>Official Audit Trail Log</span>
            </h4>
            
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-150 dark:border-slate-700/80 shadow-md max-h-[460px] overflow-y-auto">
              {sortedActions.length === 0 ? (
                <div className="py-20 text-center text-xs text-slate-400 font-bold">
                  No official audit actions logged for this session.
                </div>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-slate-700/60 ml-2 pl-4 space-y-6 text-xs font-semibold py-2">
                  {sortedActions.map((action) => (
                    <div key={action.id} className="relative space-y-1.5">
                      {/* Circle dot */}
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                      
                      <p className="text-slate-700 dark:text-slate-100 font-extrabold leading-tight">
                        {action.description}
                      </p>

                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock size={10} /> {new Date(action.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Calculate Rank base bounds
  const getRankAndLimits = (p: number) => {
    if (p < 50) {
      return {
        rank: 'Concerned Citizen',
        nextRank: 'Active Reporter',
        lowerLimit: 0,
        upperLimit: 50,
        remaining: 50 - p
      };
    } else if (p < 150) {
      return {
        rank: 'Active Reporter',
        nextRank: 'Community Guardian',
        lowerLimit: 50,
        upperLimit: 150,
        remaining: 150 - p
      };
    } else if (p < 300) {
      return {
        rank: 'Community Guardian',
        nextRank: 'City Champion',
        lowerLimit: 150,
        upperLimit: 300,
        remaining: 300 - p
      };
    } else if (p < 500) {
      return {
        rank: 'City Champion',
        nextRank: 'Civic Legend',
        lowerLimit: 300,
        upperLimit: 500,
        remaining: 500 - p
      };
    } else {
      return {
        rank: 'Civic Legend',
        nextRank: 'Max Rank Unlocked',
        lowerLimit: 500,
        upperLimit: 500,
        remaining: 0
      };
    }
  };

  const rankInfo = getRankAndLimits(points);
  const totalRange = rankInfo.upperLimit - rankInfo.lowerLimit;
  const currentDiff = points - rankInfo.lowerLimit;
  const progressPercent = totalRange > 0 
    ? Math.min(Math.round((currentDiff / totalRange) * 100), 100)
    : 100;

  // Evaluate badge unlocking logic dynamically
  const userReportedIssuesCount = issues.length; // Active count
  const hasFirstReport = userReportedIssuesCount >= 1;
  const hasCommunityVerified = issues.some(i => i.upvotes >= 5);
  const hasStreetHero = userReportedIssuesCount >= 5;
  const hasLocalGuardian = userReportedIssuesCount >= 10;
  const hasCivicChampion = points >= 500;

  const badges = [
    {
      id: 'badge-1',
      name: 'First Report',
      description: 'Reported your first civic issue successfully.',
      unlocked: hasFirstReport,
      requirement: 'Report 1 issue to unlock'
    },
    {
      id: 'badge-2',
      name: 'Community Verified',
      description: 'Received 5+ citizen upvotes on one of your reported tickets.',
      unlocked: hasCommunityVerified,
      requirement: 'Get 5 upvotes on any issue to unlock'
    },
    {
      id: 'badge-3',
      name: 'Street Hero',
      description: 'Reported 5 or more civic issues inside community borders.',
      unlocked: hasStreetHero,
      requirement: 'Report 5+ issues to unlock'
    },
    {
      id: 'badge-4',
      name: 'Local Guardian',
      description: 'Reported 10 or more civic issues across multiple wards.',
      unlocked: hasLocalGuardian,
      requirement: 'Report 10+ issues to unlock'
    },
    {
      id: 'badge-5',
      name: 'Civic Champion',
      description: 'Accumulated 500+ karma points to unlock the supreme citizen tier.',
      unlocked: hasCivicChampion,
      requirement: 'Earn 500 points to unlock'
    }
  ];

  const sortedActions = [...profile.actions].sort((a,b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="animate-fadeIn space-y-8 pb-16">
      {/* Profile Card Header */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-slate-700/80 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        {/* Saffron circle avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FF6B35] text-white font-black text-3.5xl flex items-center justify-center shadow-xl select-none flex-shrink-0">
          {getInitials(profile.name)}
        </div>

        {/* User identification */}
        <div className="space-y-4 flex-1 text-center md:text-left w-full">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#1B3A6B] dark:text-white flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
              {profile.name}
              <span className="text-xs bg-orange-50 text-[#FF6B35] dark:bg-orange-950/20 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                Rank: {rankInfo.rank}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Citizen registered since: {profile.joinDate}
            </p>
          </div>

          {/* Points display + Next rank Progress bar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between text-xs font-bold gap-2">
              <span className="text-slate-500">
                KARMA RANKING PROGRESS ({progressPercent}% Complete)
              </span>
              <span className="text-slate-600 dark:text-[#FF6B35]">
                {rankInfo.remaining > 0 ? `${rankInfo.remaining} points remaining to unlock ${rankInfo.nextRank}` : 'Maximum Citizenship Unlocked!'}
              </span>
            </div>
            
            {/* Real Progress tracker */}
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-[#FF6B35] h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global points counter column block */}
        <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-8 text-center flex-shrink-0 space-y-1 w-full md:w-auto">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Total Points</p>
          <h2 className="text-5xl font-black text-[#FF6B35]">{points}</h2>
          <p className="text-[10px] text-slate-400 font-bold">Welfare points index</p>
        </div>
      </section>

      {/* Badges and Activity panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Badges Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider">
            Unlocked Citizenship Badges
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div 
                id={`badge-card-${badge.id}`}
                key={badge.id}
                className={`p-5 rounded-2xl border relative overflow-hidden transition-all flex flex-col h-full shadow-sm ${
                  badge.unlocked
                    ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700/80 hover:scale-102 hover:shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-dashed border-slate-200 dark:border-slate-800 opacity-60 select-none'
                }`}
              >
                {/* Lock icon overlay if locked */}
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-xxs flex items-center justify-center z-10">
                    <span className="p-2 rounded-full text-amber-500 bg-white shadow-md dark:bg-slate-800">
                      <Lock size={16} />
                    </span>
                  </div>
                )}

                <div className="space-y-2 flex-grow">
                  <h5 className="text-sm font-extrabold text-[#1B3A6B] dark:text-blue-200">
                    {badge.name}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed font-semibold">
                    {badge.description}
                  </p>
                </div>
                
                {/* Requirements footnotes */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  {badge.unlocked ? '✓ Verified Unlocked' : badge.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log Panel */}
        <div className="space-y-4">
          <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider">
            Citizenship Activity Log
          </h4>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md max-h-[460px] overflow-y-auto">
            {sortedActions.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400 font-bold">
                No history entries logged yet.
              </div>
            ) : (
              <div className="relative border-l border-slate-200 dark:border-slate-700/60 ml-2 pl-4 space-y-6 text-xs font-semibold py-2">
                {sortedActions.map((action) => (
                  <div key={action.id} className="relative space-y-1.5">
                    {/* Circle icon dot */}
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                    
                    <div className="flex items-center justify-between">
                      <p className="text-slate-700 dark:text-slate-100 font-extrabold leading-none">{action.description}</p>
                      <span className="text-orange-500 font-black flex-shrink-0 ml-2">
                        +{action.points}
                      </span>
                    </div>

                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={10} /> {new Date(action.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
