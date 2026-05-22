"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface Props {
  strengths: string[];
  improvements: string[];
}

export default function RecruiterImpression({
  strengths,
  improvements,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* POSITIVES */}

      <div className="rounded-[28px] border border-lime-400/10 bg-lime-400/[0.03] p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400/[0.08] border border-lime-400/10">
            <CheckCircle2 className="w-5 h-5 text-lime-300" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              Positive Signals
            </h3>

            <p className="text-sm text-white/35">
              Recruiter strengths detected
            </p>
          </div>
        </div>

        <div className="space-y-4">

          {(strengths || []).length > 0 ? (
            strengths.map((item, i) => (
              <div
                key={i}
                className="
                  rounded-2xl
                  border border-white/[0.05]
                  bg-black/20
                  p-4
                "
              >
                <p className="text-sm leading-7 text-white/70">
                  {item}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white/35 text-sm">
              No recruiter strengths detected.
            </p>
          )}
        </div>
      </div>

      {/* RISKS */}

      <div className="rounded-[28px] border border-orange-400/10 bg-orange-400/[0.03] p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400/[0.08] border border-orange-400/10">
            <AlertTriangle className="w-5 h-5 text-orange-300" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              Critical Risks
            </h3>

            <p className="text-sm text-white/35">
              Potential recruiter concerns
            </p>
          </div>
        </div>

        <div className="space-y-4">

          {(improvements || []).length > 0 ? (
            improvements.map((item, i) => (
              <div
                key={i}
                className="
                  rounded-2xl
                  border border-white/[0.05]
                  bg-black/20
                  p-4
                "
              >
                <p className="text-sm leading-7 text-white/70">
                  {item}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white/35 text-sm">
              No major ATS risks detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}