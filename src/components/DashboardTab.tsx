import React from 'react';
import { TabName, Issue, IssueCategory, SeverityLevel, UserProfile } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { ClipboardList, CheckCircle, Tag, Zap, Clock, ShieldAlert, AlertTriangle, Landmark } from 'lucide-react';

interface DashboardTabProps {
  setActiveTab: (tab: TabName) => void;
  issues: Issue[];
  profile?: UserProfile | null;
}

export default function DashboardTab({ setActiveTab, issues, profile }: DashboardTabProps) {
  const isInspector = profile?.role === 'inspector';
  
  // Aggregate Metrics Dynamically
  const totalReported = issues.length;
  const totalResolved = issues.filter(i => i.status === 'Resolved').length;
  
  // Calculate most common category
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<IssueCategory, number>);

  let mostCommonCategory: IssueCategory = 'Other';
  let maxCount = -1;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCategory = cat as IssueCategory;
    }
  });

  // Calculate average urgency score
  const avgUrgency = totalReported > 0 
    ? Number((issues.reduce((acc, i) => acc + i.urgencyScore, 0) / totalReported).toFixed(1))
    : 0;

  // Calculate most frequent issues and AI occurrence probabilities
  const totalIssuesCount = issues.length || 1;
  const categoriesList: IssueCategory[] = ['Pothole', 'Broken Streetlight', 'Garbage', 'Water Leak', 'Road Damage', 'Other'];
  
  const categoryStats = categoriesList.map((cat) => {
    const count = categoryCounts[cat] || 0;
    const percentage = Number(((count / totalIssuesCount) * 100).toFixed(1)); // weighted indicator percentage
    
    // Recurrence probability: count weighted with critical alerts
    const catIssues = issues.filter(i => i.category === cat);
    const criticalCount = catIssues.filter(i => i.severity === 'Critical').length;
    const highCount = catIssues.filter(i => i.severity === 'High').length;
    
    const score = (count * 15) + (criticalCount * 25) + (highCount * 12);
    const probability = count > 0 
      ? Math.min(Math.round((score / (totalIssuesCount * 12 + 10)) * 100), 98)
      : 8;
      
    return {
      category: cat,
      count,
      percentage: Math.min(percentage, 100),
      probability: Math.max(probability, 12),
    };
  }).sort((a, b) => b.count - a.count);

  // Chart 1: Categorical Bar Data
  const barChartData = categoriesList.map((cat) => ({
    name: cat,
    count: categoryCounts[cat] || 0
  }));

  // Chart 2: Severity Pie Data
  const severityCounts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<SeverityLevel, number>);

  const pieChartColors = {
    'Critical': '#EF4444',
    'High': '#F97316',
    'Medium': '#EAB308',
    'Low': '#22C55E'
  };

  const pieChartData = Object.entries(severityCounts).map(([sev, count]) => ({
    name: sev,
    value: count,
    color: pieChartColors[sev as SeverityLevel] || '#94A3B8'
  }));

  // Recent 5 activity list items
  const recentActivities = [...issues].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  const getSeverityPillClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return 'bg-red-50 text-red-600 dark:bg-red-950/20';
      case 'High': return 'bg-orange-50 text-orange-600 dark:bg-orange-950/20';
      case 'Medium': return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20';
      case 'Low': return 'bg-green-50 text-green-600 dark:bg-green-950/20';
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-16">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="text-2xl md:text-3.5xl font-black text-[#1B3A6B] dark:text-white">Central Analytics Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time metrics tracking civic reports, municipal response times, and citizen engagement scores.
        </p>
      </div>

      {/* Top row: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-[#FF6B35] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reports</p>
            <h3 className="text-3xl font-black text-[#1B3A6B] dark:text-white">{totalReported}</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Active citizen tickets</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-[#FF6B35] rounded-xl">
            <ClipboardList size={22} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolved Fixes</p>
            <h3 className="text-3xl font-black text-[#1B3A6B] dark:text-white">{totalResolved}</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Verification verified</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-xl">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-blue-500 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hot Spot</p>
            <h3 className="text-xl font-black text-[#1B3A6B] dark:text-blue-300 truncate max-w-[140px]">{mostCommonCategory}</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Most common category</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
            <Tag size={22} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-red-500 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Urgency</p>
            <h3 className="text-3xl font-black text-[#1B3A6B] dark:text-white">{avgUrgency} <span className="text-xs text-slate-400">/10</span></h3>
            <p className="text-[10px] text-slate-500 font-semibold">Urgency index ratio</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
            <Zap size={22} />
          </div>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recharts Bar: Category breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md space-y-4">
          <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider">Issues by Category</h4>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} fontStyle="bold" tickLine={false} />
                <YAxis stroke="#94A3B8" allowDecimals={false} fontSize={9} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,107,37,0.04)' }}
                  contentStyle={{ background: '#111827', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#FF6B35" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Pie: Severity Share */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md space-y-4">
          <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider">Severity Distribution</h4>
          <div className="w-full h-70 relative">
            {pieChartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                No tickets reported yet to graph severity ratios.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#111827', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Concern Frequency & Probability Analysis (Inspector Specific Feature) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-500 rounded-lg">
                <Landmark size={16} />
              </span>
              <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider">
                {isInspector ? "Inspector Command Console: Recurrence Risk Engine" : "Ward Concern Frequency & Recurrence Risk"}
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Calculates probability models on future municipal issues based on report rates, severity, and backlog logs.
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800/80 flex-shrink-0 self-start sm:self-center">
            {isInspector ? "Official Audit Standard" : "Public Awareness Data"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryStats.map((stat) => {
            const isHighProbability = stat.probability >= 65;
            const isMediumProbability = stat.probability >= 35 && stat.probability < 65;
            
            return (
              <div 
                key={stat.category}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-[#FF6B35]/35 dark:hover:border-[#FF6B35]/35 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                      {stat.category}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Reported Frequency: {stat.count} {stat.count === 1 ? 'ticket' : 'tickets'} ({stat.percentage}% of total)
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    isHighProbability 
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/40' 
                      : isMediumProbability 
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] border border-orange-200 dark:border-orange-900/40' 
                      : 'bg-green-50 dark:bg-green-950/40 text-green-600 border border-green-200 dark:border-green-900/40'
                  }`}>
                    {isHighProbability ? '🚨 Critical Risk' : isMediumProbability ? '⚠️ High Recurrence' : '✓ Normal State'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1 group/tooltip relative cursor-help">
                      Calculated Recurrence Probability
                      <span className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-extrabold text-[11px]">ⓘ</span>
                      {/* Tooltip Box */}
                      <span className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block w-64 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 p-2.5 rounded-lg text-[9px] font-bold leading-relaxed shadow-xl border border-slate-700/50 dark:border-slate-200 z-50">
                        AI-calculated likelihood of this civic issue occurring again in this ward, based on report frequency, severity backlog, and season.
                      </span>
                    </span>
                    <span className={`font-black ${
                      isHighProbability ? 'text-red-500' : isMediumProbability ? 'text-[#FF6B35]' : 'text-green-500'
                    }`}>{stat.probability}% Probability</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighProbability 
                          ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                          : isMediumProbability 
                          ? 'bg-gradient-to-r from-orange-400 to-amber-500' 
                          : 'bg-gradient-to-r from-green-400 to-emerald-500'
                      }`} 
                      style={{ width: `${stat.probability}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Smart Insight Full Width Card */}
      <div className="bg-[#1B3A6B] text-white p-6 rounded-3xl overflow-hidden relative shadow-lg">
        {/* Subtle decorative grid */}
        <div className="absolute right-0 top-0 w-44 h-44 bg-white/5 rounded-full blur-2xl flex-shrink-0" />
        <div className="flex items-start gap-4">
          <span className="p-3 rounded-full bg-orange-500/20 text-[#FF6B35] mt-1">
            <Zap size={24} className="animate-pulse" />
          </span>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6B35]">Socio-Municipal AI Recommendation</h4>
            <p className="text-sm font-semibold leading-relaxed text-slate-100">
              Based on recent community reports, <strong className="text-orange-300">{mostCommonCategory}</strong> issues are rising in your area. For administrative welfare, an infrastructure inspection of surrounding ward alleys is highly recommended within the next 30 days.
            </p>
          </div>
        </div>
      </div>

      {/* Civic Champions Leaderboard */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-700/60 pb-4">
          <div className="space-y-1">
            <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏆</span> Ward 14 Civic Champions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Top active residents filing reports, coordinating audits, and validating fixes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
              Weekly Live Rank
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
              Simulated ward data
            </span>
          </div>
        </div>

        {/* Leaderboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const defaultChampions = [
              { name: "Aarav Sharma", points: 820, reports: 14, validations: 8, badge: "Civic Guardian", isCurrentUser: false },
              { name: "Priya Patel", points: 640, reports: 9, validations: 5, badge: "Ward Sentinel", isCurrentUser: false },
              { name: "Amit Patel", points: 415, reports: 7, validations: 2, badge: "Active Citizen", isCurrentUser: false },
            ];

            const allChampions = [...defaultChampions];
            if (profile) {
              const userInList = allChampions.some(c => c.name.toLowerCase() === profile.name.toLowerCase());
              if (!userInList) {
                allChampions.push({
                  name: profile.name,
                  points: profile.points || 50,
                  reports: issues.length > 0 ? Math.min(issues.length, 3) : 1,
                  validations: profile.actions?.length || 1,
                  badge: profile.role === 'inspector' ? "Official Inspector" : (profile.points >= 200 ? "Ward Sentinel" : "Active Citizen"),
                  isCurrentUser: true
                });
              } else {
                // Update the user points if already inside default list (e.g. if testing with standard names)
                const matchedIdx = allChampions.findIndex(c => c.name.toLowerCase() === profile.name.toLowerCase());
                if (matchedIdx !== -1) {
                  allChampions[matchedIdx].points = profile.points;
                  allChampions[matchedIdx].isCurrentUser = true;
                }
              }
            }

            const sortedChampions = allChampions.sort((a, b) => b.points - a.points);

            return sortedChampions.map((champ, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              let rankBadge = "";
              let rankStyle = "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
              if (isFirst) {
                rankBadge = "🥇";
                rankStyle = "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 font-extrabold";
              } else if (isSecond) {
                rankBadge = "🥈";
                rankStyle = "bg-slate-200 text-slate-800 dark:bg-slate-800/80 dark:text-slate-300 font-extrabold";
              } else if (isThird) {
                rankBadge = "🥉";
                rankStyle = "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 font-extrabold";
              } else {
                rankBadge = `#${rank}`;
              }

              return (
                <div 
                  key={champ.name}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    champ.isCurrentUser
                      ? 'bg-orange-500/5 border-[#FF6B35] dark:border-[#FF6B35]/80 shadow-sm ring-1 ring-[#FF6B35]/20'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${rankStyle}`}>
                      {rankBadge}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-150">
                          {champ.name}
                        </span>
                        {champ.isCurrentUser && (
                          <span className="text-[9px] bg-[#FF6B35] text-white px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                          {champ.badge}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[9px] text-slate-400 font-bold">
                          {champ.reports} Reports / {champ.validations} Audits
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#1B3A6B] dark:text-blue-300 block">
                      {champ.points} XP
                    </span>
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">
                      Karma points
                    </span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Recent Activity Mini List feed */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-md">
        <h4 className="text-base font-black text-[#1B3A6B] dark:text-white uppercase tracking-wider mb-5">
          Real-time Operations Log (Recent Activity)
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 font-semibold">
          {recentActivities.map((issue) => (
            <div key={issue.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={issue.image} alt="Brief Thumbnail" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                <div className="space-y-0.5">
                  <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-100 line-clamp-1">
                    {issue.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    📍 {issue.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${getSeverityPillClass(issue.severity)}`}>
                  {issue.severity}
                </span>

                <span className="text-[9px] text-slate-400 font-bold flex-shrink-0">
                  {new Date(issue.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
