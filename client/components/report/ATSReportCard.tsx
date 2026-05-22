"use client";

import Link from "next/link";

interface Report {
  _id: string;
  atsScore?: number;
  executiveSummary?: string;
  summary?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
  scoreBreakdown?: Record<string, number>;
  createdAt?: string;
}

export const ATSReportCard = ({
  report,
}: {
  report: Report;
}) => {

  const atsScore = report?.atsScore || 0;

  const scoreColor =
    atsScore >= 80
      ? "from-lime-400 to-lime-300"
      : atsScore >= 60
      ? "from-orange-400 to-yellow-300"
      : "from-red-400 to-rose-300";

  const scoreLabel =
    atsScore >= 80
      ? "Excellent"
      : atsScore >= 60
      ? "Good"
      : "Needs Work";

  const formattedDate = report?.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : "Recently";

  const matchedSkills = Array.isArray(report?.matchedSkills)
    ? report.matchedSkills
    : [];

  const scoreBreakdown =
    report?.scoreBreakdown || {};

  return (
    <Link href={`/results/${report?._id || ""}`}>

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-white/[0.06]
          bg-white/[0.03]
          backdrop-blur-2xl
          p-7
          transition-all
          duration-500
          hover:-translate-y-1.5
          hover:border-lime-400/20
          hover:bg-white/[0.045]
        "
      >

        {/* Ambient Glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.08),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute top-[-20%] right-[-10%] w-[180px] h-[180px] bg-lime-400/10 blur-[100px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* CONTENT */}

        <div className="relative z-10">

          {/* TOP */}

          <div className="flex items-start justify-between">

            {/* SCORE */}

            <div className="flex items-center gap-4">

              <div
                className={`
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${scoreColor}
                  text-black
                  font-bold
                  text-xl
                  shadow-[0_0_35px_rgba(163,230,53,0.18)]
                `}
              >
                {atsScore}

                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  ATS Score
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {scoreLabel}
                </h3>
              </div>
            </div>

            {/* DATE */}

            <div className="rounded-full border border-white/[0.06] bg-black/20 px-3 py-1.5 text-xs text-white/40">
              {formattedDate}
            </div>
          </div>

          {/* SUMMARY */}

          <div className="mt-7">

            <p className="line-clamp-3 text-[15px] leading-7 text-white/55">
              {report?.executiveSummary ||
                report?.summary ||
                "AI-generated ATS report and recruiter compatibility analysis."}
            </p>
          </div>

          {/* SKILLS */}

          <div className="mt-7 flex flex-wrap gap-2">

            {matchedSkills.length > 0 ? (
              matchedSkills
                .slice(0, 4)
                .map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="
                      rounded-full
                      border border-lime-400/10
                      bg-lime-400/[0.08]
                      px-3 py-1.5
                      text-xs
                      text-lime-300
                    "
                  >
                    {skill}
                  </div>
                ))
            ) : (
              <div className="rounded-full border border-white/[0.06] bg-black/20 px-3 py-1.5 text-xs text-white/35">
                No skill tags
              </div>
            )}
          </div>

          {/* DIVIDER */}

          <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* BREAKDOWN */}

          <div className="space-y-5">

            {Object.entries(scoreBreakdown).length > 0 ? (
              Object.entries(scoreBreakdown).map(
                ([key, val]) => {

                  const value = Number(val) || 0;

                  return (
                    <div key={key}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm text-white/45 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>

                        <span className="text-sm font-medium text-white/70">
                          {value}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-gradient-to-r
                            from-lime-400
                            to-lime-200
                            transition-all
                            duration-700
                          "
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, value)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="rounded-2xl border border-white/[0.05] bg-black/20 p-4 text-sm text-white/35">
                Score breakdown unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};