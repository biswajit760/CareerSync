import { Cpu, Info } from "lucide-react";

import { G, sectionTitle, sectionLabel } from "@/lib/constants";
import IconWrap from "../analyze/shared/IconWrap";

interface KeywordAnalysisProps {
  data: {
    missingSkills: string[];
    matchedSkills: string[];
  };
}

export default function KeywordAnalysis({ data }: KeywordAnalysisProps) {
  // Static list for "Weak Keywords" as seen in your original code
  const weakKeywords = ["Responsive Design", "Collaboration", "Java"];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
        <IconWrap gradient={G.keyword} size="md">
          <Cpu size={14} />
        </IconWrap>
        <div>
          <h2 className={`${sectionTitle} !text-[15px]`}>
            Keyword & ATS Analysis
          </h2>
          <p className={`${sectionLabel} mt-0.5`}>
            Semantic match & gap report
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* MISSING KEYWORDS */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-slate-500">
            Missing keywords from JD
            <Info size={12} className="text-slate-400" />
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill, i) => (
              <span
                key={i}
                className="cursor-default rounded-full border border-rose-100 bg-[#FFF5F5] px-4 py-1.5 text-[13px] font-medium text-[#C53030] shadow-sm transition-transform hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* WEAK KEYWORDS */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold text-slate-500">
            Weak keywords (present but not impactful)
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakKeywords.map((skill, i) => (
              <span
                key={i}
                className="cursor-default rounded-full border border-amber-100 bg-[#FFFBEB] px-4 py-1.5 text-[13px] font-medium text-[#92400E] shadow-sm transition-transform hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* SUGGESTED REPLACEMENTS */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold text-slate-500">
            Suggested strong replacements
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matchedSkills
              .filter((s) => s.length > 5)
              .slice(0, 6)
              .map((skill, i) => (
                <span
                  key={i}
                  className="cursor-default rounded-full border border-emerald-100 bg-[#F0FFF4] px-4 py-1.5 text-[13px] font-medium text-[#2F855A] shadow-sm transition-all hover:shadow-md hover:scale-105"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}