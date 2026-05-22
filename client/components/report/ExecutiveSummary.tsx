"use client";

import { Sparkles } from "lucide-react";

interface Props {
  content?: string;
}

export default function ExecutiveSummary({ content }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-8">

      {/* Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[220px] h-[220px] bg-lime-400/10 blur-[120px] rounded-full" />

      <div className="relative z-10">

        <div className="flex items-center gap-3 mb-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-400/15 bg-lime-400/[0.08]">
            <Sparkles className="w-5 h-5 text-lime-300" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              AI Executive Summary
            </h3>

            <p className="text-sm text-white/35">
              Recruiter-focused ATS overview
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-6">

          <p className="text-[15px] leading-8 text-white/65">
            {content ||
              "This candidate demonstrates strong full-stack engineering capability with solid ATS compatibility, relevant technical projects, and practical MERN stack expertise. The resume aligns well with recruiter expectations, though keyword optimization and technical depth can be further improved for higher shortlist probability."}
          </p>
        </div>
      </div>
    </div>
  );
}