import { Target, ArrowRight } from "lucide-react";

import { G, sectionTitle } from "@/lib/constants";
import IconWrap from "../analyze/shared/IconWrap";

interface CriticalGapsProps {
  improvements: string[];
  score: number;
}

export default function CriticalGaps({ improvements, score }: CriticalGapsProps) {
  // Defensive check: if no improvements exist, we can hide the section or show a success state
  if (!improvements || improvements.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/30 px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Using the gaps gradient from your constants */}
          <IconWrap gradient={G.gaps} size="md">
            <Target size={14} />
          </IconWrap>
          <div>
            <h2 className={sectionTitle}>Critical Gaps to Fix</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Key improvements needed for {score}%+ shortlist probability
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 shadow-sm">
          High Priority
        </span>
      </div>

      {/* GAP LIST SECTION */}
      <div className="space-y-3 p-5">
        {improvements.slice(0, 3).map((gap: string, i: number) => (
          <div
            key={i}
            className="group flex items-start gap-4 rounded-md border border-l-4 border-rose-200 border-l-rose-500 bg-rose-50 px-4 py-3 transition-all hover:bg-rose-100/60"
          >
            {/* Circular Numbering */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white transition-colors group-hover:border-rose-200 group-hover:bg-rose-100">
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-rose-600">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Gap Content */}
            <div className="flex-grow">
              <p className="mb-2 text-[13px] font-semibold leading-relaxed text-slate-800">
                {gap}
              </p>
            </div>

            {/* Micro-interaction Arrow */}
            <ArrowRight
              size={14}
              className="flex-shrink-0 self-center text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-rose-400"
            />
          </div>
        ))}
      </div>
    </section>
  );
}