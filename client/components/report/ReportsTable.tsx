"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReportRow from "./ReportRow";

export default function ReportsTable({ reports }: any) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!reports) return [];

    let data = [...reports];

    if (filter === "high") {
      data = data.filter((r: any) => r.atsScore >= 80);
    } else if (filter === "low") {
      data = data.filter((r: any) => r.atsScore < 80);
    }

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
    reports?.reduce(
      (acc: number, r: any) => acc + r.atsScore,
      0
    ) / (reports?.length || 1);

  const bestScore = Math.max(
    ...(reports?.map((r: any) => r.atsScore) || [0])
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pt-28 pb-20">

      {/* ================= BACKGROUND ================= */}

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-10%]
          top-[10%]
          w-[500px]
          h-[500px]
          bg-lime-400/10
          blur-[140px]
          rounded-full
          pointer-events-none
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[-10%]
          bottom-[0%]
          w-[500px]
          h-[500px]
          bg-lime-400/10
          blur-[140px]
          rounded-full
          pointer-events-none
        "
      />

      {/* Noise Texture */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          mix-blend-soft-light
          pointer-events-none
        "
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* ================= CONTENT ================= */}

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ================= HERO ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.9,
          }}
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/[0.08]
            bg-white/[0.03]
            backdrop-blur-2xl
            p-8
            md:p-10
            shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
          "
        >

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-lime-400/[0.03] via-transparent to-transparent" />

          {/* Header */}
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-7">

                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_12px_#a3e635]"></span>
                </div>

                <span className="text-sm tracking-wide text-white/70">
                  Reports Dashboard
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-[500] tracking-tight text-white leading-tight">
                Your Resume{" "}
                
                
                <span
                className="
                  bg-gradient-to-b
                  from-white
                  via-lime-200
                  to-lime-400
                  bg-clip-text
                  text-transparent
                "
              >
                Reports Overview
              </span>
              </h1>

              <p className="mt-4 text-md text-white/45 leading-relaxed max-w-2xl">
                Track ATS performance, identify resume gaps,
                and monitor improvements across all your
                AI-generated resume reports.
              </p>
            </div>

            {/* CTA */}
            <Link href="/analyze">
              <button
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-full
                  bg-lime-400
                  px-8
                  py-4
                  text-black
                  font-medium
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_0_50px_rgba(163,230,53,0.35)]
                "
              >
                <span className="relative z-10">
                  + New Scan
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-lime-400 opacity-0 group-hover:opacity-100 transition duration-300" />
              </button>
            </Link>
          </div>

          {/* ================= STATS ================= */}

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

            <StatCard
              icon={FileText}
              label="Total Reports"
              value={reports?.length || 0}
            />

            <StatCard
              icon={TrendingUp}
              label="Average Score"
              value={`${avgScore?.toFixed(0)}%`}
            />

            <StatCard
              icon={Sparkles}
              label="Best Score"
              value={`${bestScore}%`}
            />
          </div>
        </motion.div>

        {/* ================= SEARCH ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="
            mt-8
            rounded-[1rem]
            border
            border-white/[0.08]
            bg-white/[0.03]
            backdrop-blur-2xl
            p-4
          "
        >

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* Search */}
            <div className="flex items-center flex-1 rounded-2xl border border-white/[0.06] bg-black/20 px-5 py-4">

              <Search
                size={18}
                className="text-white/35 mr-3"
              />

              <input
                placeholder="Search by score or report status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-white
                  placeholder:text-white/30
                "
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">

              {[
                {
                  label: "All",
                  value: "all",
                },
                {
                  label: "High Score",
                  value: "high",
                },
                {
                  label: "Needs Work",
                  value: "low",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`
                    px-5
                    py-3
                    rounded-full
                    text-sm
                    transition-all
                    duration-300
                    border

                    ${
                      filter === item.value
                        ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.25)]"
                        : "bg-white/[0.03] border-white/[0.06] text-white/55 hover:text-white hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ================= TABLE ================= */}

        <div className="mt-8 flex flex-col gap-5">
          {filtered.map((report: any, index: number) => (
            <ReportRow
              key={report._id}
              report={report}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        relative
        overflow-hidden
        rounded-[1rem]
        border
        border-white/[0.08]
        bg-black/30
        backdrop-blur-2xl
        p-5
      "
    >

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-400/[0.03] via-transparent to-transparent opacity-0 hover:opacity-100 transition duration-500" />

      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-sm text-white/45">
            {label}
          </p>

          <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            {value}
          </h3>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Icon className="w-4 h-4 text-lime-300" />
        </div>
      </div>
    </motion.div>
  );
}