"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

export default function ReportRow({
  report,
  index,
}: any) {
  const score = report?.atsScore || 0;
  const router = useRouter();
  const status =
    score >= 85
      ? "Excellent"
      : score >= 70
      ? "Good"
      : "Needs Work";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
      }}
      whileHover={{
        y: -2,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[1rem]
        border
        border-white/[0.08]
        bg-white/[0.03]
        backdrop-blur-2xl
        px-6
        py-4
        transition-all
        duration-300
        hover:border-lime-400/15
        hover:bg-white/[0.04]
      "
    >

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* Shimmer */}
      <motion.div
        animate={{
          x: ["-100%", "250%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          top-0
          left-0
          h-full
          w-[30%]
          bg-gradient-to-r
          from-transparent
          via-white/[0.025]
          to-transparent
          skew-x-[-25deg]
        "
      />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-5 min-w-0">

          {/* Score */}
          <div
            className="
              relative
              flex
              items-center
              justify-center
              w-[72px]
              h-[72px]
              rounded-[1.5rem]
              border
              border-lime-400/15
              bg-lime-400/[0.08]
              shrink-0
            "
          >

            <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-b from-white/[0.03] to-transparent" />

            <div className="relative text-center">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {score}%
              </h3>

              <p className="text-[8px] uppercase tracking-[0.25em] text-lime-300/70">
                ATS
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0">

            {/* Top */}
            <div className="flex items-center gap-3 flex-wrap">

              <span
                className={`
                  inline-flex
                  items-center
                  rounded-full
                  px-3
                  py-1
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  border

                  ${
                    score >= 85
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : score >= 70
                      ? "border-lime-400/20 bg-lime-400/10 text-lime-300"
                      : "border-orange-400/20 bg-orange-400/10 text-orange-300"
                  }
                `}
              >
                {status}
              </span>

              <span className="text-xs text-white/30 tracking-[0.2em]">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-2 text-lg font-medium tracking-tight text-white truncate">
              Resume Performance Analysis
            </h3>

            {/* Description */}
            <p className="mt-2 text-[0.8rem] text-white/40 leading-relaxed max-w-2xl">
              ATS analysis with keyword matching, formatting
              review, and AI-powered resume insights.
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          {/* Progress */}
          <div className="w-full sm:w-[180px]">

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                Skill Match
              </span>

              <span className="text-xs text-lime-300">
                {Math.min(score + 4, 98)}%
              </span>
            </div>

            <div className="h-[6px] rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${Math.min(score + 4, 98)}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-lime-300
                  to-lime-500
                "
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* View Report */}
            <Link href={`/results/${report._id}`}>
              <button
                className="
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  px-5
                  py-3
                  text-[12px]
                  text-white/75
                  transition-all
                  duration-300
                  hover:border-lime-400/15
                  hover:bg-white/[0.05]
                  hover:text-white
                  cursor-pointer
                "
              >
                View Report
              </button>
            </Link>

            {/* Jobs */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/job-match/${report.resumeId}`);
              }}
              className="
                group/job
                relative
                overflow-hidden
                rounded-full
                bg-lime-400
                px-5
                py-3
                text-[12px]
                font-medium
                text-black
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_35px_rgba(163,230,53,0.25)]
                cursor-pointer
              "
            >

              <span className="relative z-10 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />

                Jobs
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-lime-300 to-lime-400 opacity-0 group-hover/job:opacity-100 transition duration-300" />
            </button>

            {/* Arrow */}
            <button
              className="
                hidden
                lg:flex
                items-center
                justify-center
                w-10
                h-10
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.03]
                text-white/35
                transition-all
                duration-300
                hover:text-white
                hover:border-lime-400/15
                cursor-pointer
              "
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}