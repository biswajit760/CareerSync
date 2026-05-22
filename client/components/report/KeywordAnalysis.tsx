"use client";

interface Props {
  data: any;
}

export default function KeywordAnalysis({ data }: Props) {
    console.log("KEYWORD DATA:", data);

  // ✅ SAFE FALLBACKS FOR DIFFERENT API STRUCTURES

  const missingSkills =
    data?.missingSkills ||
    data?.missingKeywords ||
    data?.keywordAnalysis?.missing ||
    [];

  const matchedSkills =
    data?.matchedSkills ||
    data?.matchedKeywords ||
    data?.keywordAnalysis?.matched ||
    [];

  return (
    <div className="space-y-10">

      {/* MATCHED KEYWORDS */}

      <div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-medium text-white">
              Matched Keywords
            </h3>

            <p className="text-sm text-white/35 mt-1">
              Strong ATS-aligned terms detected
            </p>
          </div>

          <div className="px-3 py-1 rounded-full border border-lime-400/10 bg-lime-400/[0.06] text-xs text-lime-300">
            {matchedSkills.length} matched
          </div>
        </div>

        <div className="flex flex-wrap gap-3">

          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill: string, i: number) => (
              <div
                key={i}
                className="
                  group
                  rounded-full
                  border border-lime-400/15
                  bg-lime-400/[0.08]
                  px-4 py-2
                  text-sm
                  text-lime-300
                  transition-all duration-300
                  hover:bg-lime-400/[0.14]
                  hover:border-lime-400/25
                  hover:scale-[1.03]
                "
              >
                {skill}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
              <p className="text-sm text-white/35">
                No matched keywords found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MISSING KEYWORDS */}

      <div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-medium text-white">
              Missing Keywords
            </h3>

            <p className="text-sm text-white/35 mt-1">
              Important ATS terms absent from resume
            </p>
          </div>

          <div className="px-3 py-1 rounded-full border border-orange-400/10 bg-orange-400/[0.06] text-xs text-orange-300">
            {missingSkills.length} missing
          </div>
        </div>

        <div className="flex flex-wrap gap-3">

          {missingSkills.length > 0 ? (
            missingSkills.map((skill: string, i: number) => (
              <div
                key={i}
                className="
                  group
                  rounded-full
                  border border-orange-400/15
                  bg-orange-400/[0.08]
                  px-4 py-2
                  text-sm
                  text-orange-300
                  transition-all duration-300
                  hover:bg-orange-400/[0.14]
                  hover:border-orange-400/25
                  hover:scale-[1.03]
                "
              >
                {skill}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
              <p className="text-sm text-white/35">
                No missing keywords detected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}