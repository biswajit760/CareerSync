'use client';

import { useRouter } from 'next/navigation';
import { Calendar, FileText, Building2, ArrowRight } from 'lucide-react';

interface Scan {
  _id: string;
  atsScore: number;
  jobTitle: string;
  companyName: string;
  fileName: string;
  createdAt: string;
  summary: string;
}

interface RecentScansTableProps {
  scans: Scan[];
}

function ScoreBadge({ score }: { score: number }) {
  const cfg =
    score >= 80 ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    score >= 60 ? 'bg-amber-50  text-amber-700  ring-amber-200'  :
                  'bg-red-50    text-red-700    ring-red-200';
  return (
    <span className={`inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-black ring-1 tabular-nums ${cfg}`}>
      {score}
    </span>
  );
}

export default function RecentScansTable({ scans }: RecentScansTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_2px_4px_rgb(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgb(0,0,0,0.12)] transition-all duration-300">

      {/* Header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/30">
        <div>
          <p className="text-base font-bold text-slate-800 leading-tight">Recent Scans</p>
          <p className="text-xs text-slate-500 mt-1">Your latest resume analyses</p>
        </div>
        {scans.length > 0 && (
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            {scans.length} scan{scans.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-base font-semibold text-slate-600 mt-2">No scans yet</p>
          <p className="text-sm text-slate-400">Upload a resume to get your first ATS score.</p>
        </div>
      ) : (
        <>
          {/* Table head */}
          <div className="grid grid-cols-[100px_1fr_1fr_60px_1fr_90px] gap-4 px-7 py-3 bg-slate-50/60 border-b border-slate-100">
            {['Date', 'Resume', 'Job Title', 'Score', 'Summary', ''].map((h, i) => (
              <span key={i} className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="grid grid-cols-[100px_1fr_1fr_60px_1fr_90px] gap-4 items-center px-7 py-4 hover:bg-slate-50/60 transition-colors group"
              >
                {/* Date */}
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="text-xs text-slate-600 font-medium truncate">
                    {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </span>
                </div>

                {/* Resume */}
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="text-xs text-slate-700 font-semibold truncate">{scan.fileName || 'Unknown'}</span>
                </div>

                {/* Job Title */}
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 font-semibold truncate">{scan.jobTitle || 'Untitled'}</p>
                    {scan.companyName && (
                      <p className="text-[10px] text-slate-400 truncate">{scan.companyName}</p>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div>
                  <ScoreBadge score={scan.atsScore} />
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pr-2">
                  {scan.summary || '—'}
                </p>

                {/* Action */}
                <button
                  onClick={() => router.push(`/results/${scan._id}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors ml-auto group-hover:gap-2"
                >
                  View
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}