"use client";

import Link from "next/link";

export const ATSReportCard = ({ report }: any) => {
  const scoreColor =
    report.atsScore >= 80
      ? "bg-green-500"
      : report.atsScore >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <Link href={`/results/${report._id}`}>
      <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">

        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          
          {/* Score */}
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 flex items-center justify-center rounded-xl text-white font-bold ${scoreColor}`}>
              {report.atsScore}
            </div>

            <div>
              <p className="text-sm text-slate-500">ATS Score</p>
              <p className="text-lg font-semibold">
                {report.atsScore >= 80
                  ? "Excellent"
                  : report.atsScore >= 60
                  ? "Good"
                  : "Needs Work"}
              </p>
            </div>
          </div>

          {/* Date */}
          <span className="text-xs text-slate-400">
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {report.executiveSummary || report.summary}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {report.matchedSkills?.slice(0, 4)?.map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-3"></div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(report.scoreBreakdown ?? {}).map(([key, val]) => {
            const value = Number(val);
            return (
              <div key={key}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{key}</span>
                  <span>{value}</span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  />
                </div>
              </div>
            );
          })}        </div>

      </div>
    </Link>
  );
};