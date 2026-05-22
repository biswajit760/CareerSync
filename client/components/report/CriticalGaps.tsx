"use client";

import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface Props {
  improvements: string[];
  score: number;
}

export default function CriticalGaps({
  improvements,
  score,
}: Props) {
  // Deduplicate and filter improvements
  const uniqueImprovements = Array.from(new Set(improvements || [])).filter(
    (item) => item && item.trim().length > 0
  );

  // Extract title from first sentence of improvement
  const getTitle = (text: string) => {
    const firstSentence = text.split(".")[0];
    return firstSentence.length > 50
      ? firstSentence.substring(0, 47) + "..."
      : firstSentence;
  };

  return (
    <div className="space-y-4">

      {uniqueImprovements.length > 0 ? (
        uniqueImprovements.map((item, i) => (
          <div
            key={i}
            className="
              group
              flex items-start justify-between
              gap-5
              rounded-[24px]
              border border-white/[0.06]
              bg-black/20
              p-6
              transition-all duration-300
              hover:border-orange-400/20
              hover:bg-orange-400/[0.03]
            "
          >

            <div className="flex gap-4">

              <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-400/[0.08]">
                <AlertTriangle className="w-5 h-5 text-orange-300" />
              </div>

              <div>

                <h4 className="text-white font-medium">
                  {getTitle(item)}
                </h4>

                <p className="mt-2 text-sm leading-7 text-white/55">
                  {item}
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-orange-300 transition-colors" />
          </div>
        ))
      ) : (
        <div className="rounded-[24px] border border-lime-400/10 bg-lime-400/[0.04] p-6">

          <p className="text-lime-300">
            No major ATS gaps detected.
          </p>
        </div>
      )}
    </div>
  );
}