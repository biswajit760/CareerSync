import React from 'react'
import AtsCircularGauge from '../analyze/AtsCircularGauge'
import { getShortlistProbability } from '@/lib/constants';

const sectionLabel =
  "text-[10px] font-bold uppercase tracking-widest text-slate-500";

// Section title: 13px, semibold, slate-800
const sectionTitle = "text-[13px] font-semibold text-slate-800";

const getKeywordLabel = (val = 0): string => {
  if (val >= 85) return "Excellent";
  if (val >= 70) return "Strong";
  if (val >= 50) return "Moderate";
  return "Low";
};

const AnalysisHeader = ({ atsScore, skillsMatch, keywordMatch }: any) => {
  // Logic function for selection Probability
  const shortlistPct = getShortlistProbability(atsScore);
  return (
    <header className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* ATS Score */}
              <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <AtsCircularGauge score={atsScore} />
              </div>
    
              {/* Skills Match */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className={sectionLabel + " mb-2"}>Skills Match</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-emerald-600">
                    {skillsMatch}%
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {getKeywordLabel(skillsMatch)}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${skillsMatch}%` }}
                  />
                </div>
              </div>
    
              {/* Keyword Match */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className={sectionLabel + " mb-2"}>Keyword Match</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-amber-600">
                    {keywordMatch}%
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {getKeywordLabel(keywordMatch)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {[20, 40, 60, 80, 100].map((t) => (
                    <div
                      key={t}
                      className={`h-2 w-2 rounded-full ${keywordMatch >= t ? "bg-amber-500" : "bg-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
    
              {/* Shortlist Probability */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-md">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <p className={sectionLabel + " mb-2 !text-slate-300"}>
                  Shortlist Probability
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{shortlistPct}%</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {getKeywordLabel(shortlistPct)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  Based on ATS + skills alignment
                </p>
              </div>
            </header>
  )
}

export default AnalysisHeader