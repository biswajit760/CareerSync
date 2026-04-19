import { Search, TrendingUp, AlertTriangle, Check, X } from "lucide-react";

import { G, sectionTitle, sectionLabel } from "@/lib/constants";
import IconWrap from "../analyze/shared/IconWrap";

type RecruiterImpressionProps = {
  strengths: string[];
  improvements: string[];
};

export default function RecruiterImpression({ strengths, improvements }: RecruiterImpressionProps) {
  return (
    <section className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/40 px-8 py-5">
        <div className="flex items-center gap-4">
          <IconWrap gradient={G.recruiter} size="md">
            <Search size={14} />
          </IconWrap>
          <div>
            <h2 className={sectionTitle}>Recruiter Impression Report</h2>
          </div>
        </div>
        
        {/* Live AI Audit Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 md:flex">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className={sectionLabel}>Live AI Audit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
        
        {/* LEFT COLUMN: STRENGTHS */}
        <div className="p-8">
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 py-1 pl-0.5 pr-3 text-[10px] font-bold uppercase tracking-widest text-green-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-700 text-white">
                <TrendingUp size={10} strokeWidth={2.5} />
              </span>
              Positive Signals
            </span>
            <span className={sectionLabel + " !text-slate-300"}>
              {strengths.slice(0, 5).length.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-3">
            {strengths.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="group/item flex items-start gap-3 rounded-xl border border-transparent p-1.5 transition-all hover:border-emerald-100 hover:bg-emerald-50/40"
              >
                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-green-50 text-green-700">
                  <Check size={10} strokeWidth={3} />
                </div>
                <span className="text-[13px] font-medium leading-relaxed text-slate-600 group-hover/item:text-slate-900">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RISKS */}
        <div className="p-8">
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 py-1 pl-0.5 pr-3 text-[10px] font-bold uppercase tracking-widest text-rose-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-red-700 text-white">
                <AlertTriangle size={10} strokeWidth={2.5} />
              </span>
              Critical Risks
            </span>
            <span className="text-[10px] font-bold text-slate-300">
              Priority: High
            </span>
          </div>

          <div className="space-y-3">
            {improvements.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="group/item flex items-start gap-3 rounded-xl border border-transparent p-1.5 transition-all hover:border-rose-100 hover:bg-rose-50/40"
              >
                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-rose-600 bg-rose-50 text-rose-700">
                  <X size={10} strokeWidth={3} />
                </div>
                <span className="text-[13px] font-medium leading-relaxed text-slate-600 group-hover/item:text-slate-900">
                  {item.split(".")[0] || item}
                </span>              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}