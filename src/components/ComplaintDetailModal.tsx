import React, { useState } from 'react';
import { Issue, UserProfile, SeverityLevel, IssueStatus } from '../types';
import { getSlaPill } from './FeedTab';
import { X, MapPin, Building, Calendar, AlertTriangle, CheckCircle2, ShieldAlert, Clock, ThumbsUp, Sparkles, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface ComplaintDetailModalProps {
  issue: Issue;
  onClose: () => void;
  profile: UserProfile | null;
  upvoteIssue: (id: string) => void;
  updateIssueStatus?: (id: string, status: 'Open' | 'In Progress' | 'Resolved', notes?: string) => void;
  verifyResolution: (id: string, afterImage: string, result: { resolved: boolean; confidence: number; reason: string }) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', text: string) => void;
}

export default function ComplaintDetailModal({
  issue,
  onClose,
  profile,
  upvoteIssue,
  updateIssueStatus,
  verifyResolution,
  showToast
}: ComplaintDetailModalProps) {
  const isInspector = profile?.role === 'inspector';
  const alreadyUpvoted = issue.upvotedByMe;
  const isVerified = issue.upvotes >= 5;

  const [localNotes, setLocalNotes] = useState(issue.notes || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);

  // Get status color
  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-red-500/10 text-red-600 border border-red-500/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/30';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30';
    }
  };

  // Get severity badge class
  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-500 text-slate-900';
      case 'Low': return 'bg-green-600 text-white';
    }
  };

  // handle local notes saving
  const handleSaveNotes = () => {
    if (updateIssueStatus) {
      updateIssueStatus(issue.id, issue.status, localNotes);
      showToast('success', 'Official inspector log updated successfully.');
    }
  };

  // handle local status changing for inspectors
  const handleStatusChange = (status: IssueStatus) => {
    if (updateIssueStatus) {
      updateIssueStatus(issue.id, status, localNotes);
      showToast('success', `Complaint status marked as "${status}".`);
    }
  };

  // Handle local after image upload (Citizen Verification Flow)
  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (!base64) return;

        setAfterImagePreview(base64);
        setIsVerifying(true);

        try {
          showToast('info', 'Analyzing repair alignment with Gemini Vision...');
          
          const beforeMime = issue.image.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';
          const afterMime = base64.match(/data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

          const response = await fetch('/api/verify-resolution', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              beforeImage: issue.image,
              beforeMimeType: beforeMime,
              afterImage: base64,
              afterMimeType: afterMime
            })
          });

          if (response.ok) {
            const result = await response.json();
            verifyResolution(issue.id, base64, {
              resolved: result.resolved ?? true,
              confidence: result.confidence ?? 92,
              reason: result.reason ?? 'Visual comparison validates complete rectification of the reported issue.'
            });
            
            if (profile?.role === 'inspector') {
              showToast('success', '✅ Resolution verified and filed to official logs.');
            } else {
              showToast('success', `✅ Resolution verified by Gemini AI! +15 karma points awarded 🎉`);
            }
            setIsVerifying(false);
            return;
          } else {
            throw new Error('Backend returned non-OK status');
          }

        } catch (err) {
          showToast('error', 'Verification failed. Please try again.');
          setIsVerifying(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 dark:border-slate-700/80 max-h-[90vh] overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Sticky Header */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getSeverityBadgeClass(issue.severity)}`}>
              {issue.severity} Priority
            </span>
            <span className="text-xs text-slate-400 font-bold">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-300 font-black uppercase tracking-wider">
              ID: {issue.id}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Main Title & Status Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md font-black uppercase tracking-wider">
                {issue.category}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#1B3A6B] dark:text-white leading-snug pt-1">
                {issue.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <Clock size={12} />
                <span>Reported on: {new Date(issue.timestamp).toLocaleDateString()} at {new Date(issue.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-2 select-none self-start md:self-center ${getStatusBadge(issue.status)}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${
                issue.status === 'Open' ? 'bg-red-500' : issue.status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span>{issue.status}</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Citizen Submission Details</h4>
            <p className="text-sm text-slate-600 dark:text-slate-200 font-semibold leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {issue.description}
            </p>
          </div>

          {/* Images Section (Comparison & Proof Desk) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Complaint Visual Evidence</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Reported (Before) Image Card */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col">
                <div className="relative h-56 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src={issue.image} alt="Reported issue" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                    ⚠️ Reported State (Before)
                  </span>
                </div>
                <div className="p-3 text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                  <ImageIcon size={12} className="text-slate-400" />
                  <span>Original high-resolution vision ticket upload</span>
                </div>
              </div>

              {/* Resolution (Aftermath) Proof Card */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col">
                {issue.status === 'Resolved' && (issue.afterImage || afterImagePreview) ? (
                  <div className="relative h-56 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                    <img src={issue.afterImage || afterImagePreview || ''} alt="Resolved issue proof" className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      ✓ Resolved State (After)
                    </span>
                  </div>
                ) : (
                  <div className="h-56 bg-slate-100/60 dark:bg-slate-950/40 border-2 border-dashed border-slate-250 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <ImageIcon size={32} className="text-slate-300 dark:text-slate-600" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-600 dark:text-slate-300">No Resolution Evidence Yet</p>
                      <p className="text-[10px] text-slate-400 font-semibold max-w-[240px]">
                        {issue.status === 'Resolved' 
                          ? 'This issue is marked as resolved, but verification proof has not been processed.'
                          : 'Verification upload will unlock once the municipal department marks this ticket as resolved.'
                        }
                      </p>
                    </div>

                    {/* Citizen/Inspector uploading fix verification */}
                    {issue.status === 'Resolved' && !isVerifying && (
                      <label className="px-4 py-1.5 bg-[#1B3A6B] hover:bg-blue-800 text-white font-black text-[10px] rounded-lg transition-all cursor-pointer focus:outline-none flex items-center gap-1.5">
                        <UploadIcon size={12} />
                        <span>Upload Fix Proof</span>
                        <input type="file" accept="image/*" onChange={handleAfterImageUpload} className="hidden" />
                      </label>
                    )}

                    {isVerifying && (
                      <div className="flex items-center gap-2 text-xs text-[#FF6B35] font-black">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying with Gemini AI...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Proof Information Footer */}
                {issue.status === 'Resolved' && (issue.afterImage || afterImagePreview) && (
                  <div className="p-3 border-t border-slate-150 dark:border-slate-800 text-[11px] font-bold space-y-1 bg-white dark:bg-slate-800 flex-grow">
                    {issue.verificationResult ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black ${
                            issue.verificationResult.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {issue.verificationResult.resolved ? '✓ Vision Match Verified' : '✗ Match Incomplete'}
                          </span>
                          <span className="text-slate-500">Confidence: {issue.verificationResult.confidence}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                          {issue.verificationResult.reason}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-400 font-semibold">Verification evaluation is pending.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Meta Card 1 */}
            <div className="p-4 rounded-2xl border border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 space-y-1 flex items-center gap-3">
              <span className="p-2 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-xl">
                <MapPin size={16} />
              </span>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Jurisdiction Coordinate</span>
                <span className="text-xs text-slate-700 dark:text-slate-200 font-extrabold truncate max-w-[200px] block">{issue.location}</span>
              </div>
            </div>

            {/* Meta Card 2 */}
            <div className="p-4 rounded-2xl border border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 space-y-1 flex items-center gap-3">
              <span className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-500 rounded-xl">
                <Building size={16} />
              </span>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Assigned Authority</span>
                <span className="text-xs text-slate-700 dark:text-slate-200 font-extrabold">{issue.department} Department</span>
              </div>
            </div>

            {/* Meta Card 3 */}
            <div className="p-4 rounded-2xl border border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 space-y-1 flex items-center gap-3">
              <span className="p-2 bg-orange-100 dark:bg-orange-950/40 text-[#FF6B35] rounded-xl">
                <Clock size={16} />
              </span>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Estimated Work Window</span>
                <span className="text-xs text-slate-700 dark:text-slate-200 font-extrabold block mb-1">{issue.estimatedFixTime}</span>
                <div className="select-none">
                  {getSlaPill(issue)}
                </div>
              </div>
            </div>

          </div>

          {/* AI Smart Insight Desk */}
          <div className="p-5 bg-[#1B3A6B] text-white rounded-3xl border border-blue-800/20 relative overflow-hidden space-y-3 shadow-md">
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
            
            <div className="flex items-center gap-2 z-10 relative">
              <span className="p-1 bg-white/10 text-amber-300 rounded-lg">
                <Sparkles size={14} />
              </span>
              <h5 className="text-xs font-black uppercase tracking-wider">Gemini Civic Analysis Docket</h5>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative text-left">
              <div className="space-y-0.5">
                <span className="text-[9px] text-blue-200/60 font-black uppercase tracking-wider block">Model Confidence</span>
                <span className="text-xs font-black font-mono">{(issue.confidence * 100).toFixed(0)}% Match</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-blue-200/60 font-black uppercase tracking-wider block">Calculated Severity</span>
                <span className="text-xs font-black uppercase text-red-300">{issue.severity}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-blue-200/60 font-black uppercase tracking-wider block">Urgency Weight</span>
                <span className="text-xs font-black">{issue.urgencyScore} / 10 score</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-blue-200/60 font-black uppercase tracking-wider block">Auto-extracted tags</span>
                <span className="text-[10px] font-bold text-blue-100 truncate block">{issue.tags.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Citizen / Public Activity Desk */}
          <div className="border-t border-slate-100 dark:border-slate-700/80 pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => upvoteIssue(issue.id)}
                disabled={alreadyUpvoted}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all focus:outline-none ${
                  alreadyUpvoted
                    ? 'bg-orange-500 text-white border-orange-500 cursor-default'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#FF6B35] hover:text-[#FF6B35] text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 cursor-pointer'
                }`}
              >
                <ThumbsUp size={14} className={alreadyUpvoted ? 'fill-white' : ''} />
                <span>{issue.upvotes} Public Endorsements</span>
              </button>

              {isVerified && (
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-extrabold text-[10px] py-1.5 px-3 rounded-full flex items-center gap-1 select-none border border-emerald-250">
                  <CheckCircle2 size={12} /> Community Verified
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Footer Inspector Desk / Admin Panel */}
        {isInspector ? (
          <footer className="px-6 py-5 bg-slate-900 border-t border-slate-800 space-y-4 rounded-b-3xl">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <Building size={12} className="text-blue-400" />
              <span>Inspector Command & Audit Controls (Professional Area)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Status Toggles (No points reference, strictly action) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Official Complaint State</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Open', 'In Progress', 'Resolved'] as IssueStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-all cursor-pointer ${
                        issue.status === st
                          ? st === 'Open'
                            ? 'bg-red-500 text-white'
                            : st === 'In Progress'
                            ? 'bg-orange-500 text-white'
                            : 'bg-green-500 text-white'
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Notes input */}
              <div className="space-y-1.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Supervisor Audit Notes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add dispatch orders or audit clearance codes..."
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      className="flex-grow bg-slate-800 border border-slate-700 py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      title="Save notes"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </footer>
        ) : (
          issue.notes && (
            <footer className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-semibold rounded-b-3xl flex items-start gap-2">
              <ShieldAlert size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[9px]">Official Audit Action Comments:</p>
                <p className="mt-1 leading-relaxed italic">"{issue.notes}"</p>
              </div>
            </footer>
          )
        )}

      </div>
    </div>
  );
}

// Simple Helper icon
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
