"use client";

import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface Props {
  missingCount?: number;
}

const rows = [
  {
    section: "Contact Information",
    status: "Optimal",
    analysis: "All links verified",
    type: "good",
  },
  {
    section: "Professional Experience",
    status: "Strong",
    analysis: "Quantifiable metrics found",
    type: "good",
  },
  {
    section: "Technical Skills",
    status: "Needs Work",
    analysis: "Missing 13 key tags",
    type: "warning",
  },
];

export default function StructuralHealth({
  missingCount,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl">

      {/* Glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[260px] h-[260px] bg-lime-400/10 blur-[120px] rounded-full" />

      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-8 py-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-400/15 bg-lime-400/[0.08]">
            <ShieldCheck className="w-5 h-5 text-lime-300" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              Structural Health Check
            </h3>

            <p className="text-sm text-white/35">
              ATS formatting & optimization audit
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 space-y-4">

          {rows.map((row, i) => (
            <div
              key={i}
              className="
                flex items-center justify-between
                rounded-2xl
                border border-white/[0.05]
                bg-black/20
                px-6 py-5
              "
            >

              {/* Left */}
              <div>
                <h4 className="text-white font-medium">
                  {row.section}
                </h4>

                <p className="mt-1 text-sm text-white/35">
                  {row.analysis}
                </p>
              </div>

              {/* Right */}
              <div
                className={`
                  flex items-center gap-2
                  rounded-full px-4 py-2 text-sm

                  ${
                    row.type === "good"
                      ? "bg-lime-400/[0.08] text-lime-300 border border-lime-400/15"
                      : "bg-orange-400/[0.08] text-orange-300 border border-orange-400/15"
                  }
                `}
              >

                {row.type === "good" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}

                {row.status}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.05] px-8 py-5 flex items-center justify-between">

          <p className="text-sm text-white/35">
            Missing Keywords
          </p>

          <div className="rounded-full border border-lime-400/15 bg-lime-400/[0.08] px-4 py-2 text-sm text-lime-300">
            {missingCount || 0} Missing Skills
          </div>
        </div>
      </div>
    </div>
  );
}