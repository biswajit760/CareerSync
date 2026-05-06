"use client";
import { useState, useMemo } from "react";
import ReportRow from "./ReportRow";
import { Search } from "lucide-react";

export default function ReportsTable({ reports }: any) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!reports) return [];

    let data = [...reports];

    // FILTER
    if (filter === "high") {
      data = data.filter((r: any) => r.atsScore >= 80);
    } else if (filter === "low") {
      data = data.filter((r: any) => r.atsScore < 80);
    }

    // SEARCH
    if (query.trim() !== "") {
      const q = query.toLowerCase();

      data = data.filter((r: any) => {
        const score = r.atsScore.toString();
        const status =
          r.atsScore >= 80
            ? "excellent"
            : r.atsScore >= 60
            ? "good"
            : "needs work";

        return score.includes(q) || status.includes(q);
      });
    }

    return data;
  }, [reports, query, filter]);

  const avgScore =
    reports?.reduce((acc: number, r: any) => acc + r.atsScore, 0) /
    (reports?.length || 1);

  const bestScore = Math.max(...(reports?.map((r: any) => r.atsScore) || [0]));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white mt-20">

      {/* 🔥 HERO HEADER */}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">

          {/* TOP ROW */}
          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Your Reports Overview
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Track performance, identify gaps, and improve your resume quality
              </p>
            </div>

            <button className="bg-black text-white px-5 py-2.5 rounded-md cursor-pointer text-sm font-medium hover:opacity-90 transition shadow-sm">
              + New Scan
            </button>
          </div>

          {/* 🔥 STATS */}
          <div className="flex gap-6 mt-6">
            <StatCard label="Total Reports" value={reports?.length || 0} />
            <StatCard label="Average Score" value={`${avgScore?.toFixed(0)}%`} />
            <StatCard label="Best Score" value={`${bestScore}%`} />
          </div>
        </div>
      </section>

      {/* 🔍 SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto px-6 mt-8">

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center justify-between shadow-sm mb-6">

          {/* SEARCH */}
          <div className="flex items-center flex-1">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              placeholder="Search by score or status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-2 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* FILTER */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 ml-4">
            {[
              { label: "All", value: "all" },
              { label: "High", value: "high" },
              { label: "Needs Work", value: "low" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  filter === item.value
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 LIST */}
        <div className="space-y-4">
          {!reports ? (
            <SkeletonList />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((r: any, i: number) => (
              <ReportRow key={r._id} report={r} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔥 STAT CARD */
function StatCard({ label, value }: any) {
  return (
    <div className="flex-1 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-semibold text-slate-900 mt-1 tracking-tight">
        {value}
      </p>
    </div>
  );
}

/* 🔥 EMPTY STATE */
function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-slate-500 font-medium">No reports found</p>
      <p className="text-slate-400 text-sm mt-1">
        Try adjusting your search or filters
      </p>
    </div>
  );
}

/* 🔥 SKELETON */
function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 bg-slate-100 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}