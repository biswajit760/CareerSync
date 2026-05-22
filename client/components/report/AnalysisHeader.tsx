"use client";

import React from 'react'
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { getShortlistProbability } from '@/lib/constants';

const AnalysisHeader = ({ data }: any) => {
  // Calculate genuine shortlist probability based on ATS score
  const shortlistProbability = getShortlistProbability(data?.atsScore || 0);
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {/* ATS SCORE */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-7">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.10),transparent_35%)]" />

        <div className="relative">

          <p className="text-[11px] uppercase tracking-[0.24em] text-lime-300/60">
            ATS Score
          </p>

          <div className="mt-7 flex items-center justify-center">

            <div className="relative h-40 w-40">

              <svg className="rotate-[-90deg]" viewBox="0 0 160 160">

                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                  fill="transparent"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={427}
                  strokeDashoffset={
                    427 -
                    (427 * (data?.atsScore || 71)) / 100
                  }
                />

                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#84cc16" />
                    <stop offset="100%" stopColor="#d9f99d" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <h3 className="text-5xl font-semibold tracking-[-0.05em]">
                  {data?.atsScore || 71}
                </h3>

                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/30">
                  ATS Score
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">

            <div className="rounded-full border border-lime-400/15 bg-lime-400/[0.08] px-5 py-2 text-sm text-lime-300">
              Strong Profile
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS MATCH */}
      <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-7">

        <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
          Skills Match
        </p>

        <div className="mt-8 flex items-end justify-between">

          <h3 className="text-5xl font-semibold text-lime-300">
            {data?.scoreBreakdown?.technicalSkills || 78}%
          </h3>

          <span className="text-lime-300 text-sm">
            Strong
          </span>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/[0.05]">

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${data?.scoreBreakdown?.technicalSkills || 78}%`,
            }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-lime-400 to-lime-200"
          />
        </div>
      </div>

      {/* KEYWORD MATCH */}
      <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-7">

        <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
          Keyword Match
        </p>

        <div className="mt-8 flex items-end justify-between">

          <h3 className="text-5xl font-semibold text-orange-300">
            {data?.scoreBreakdown?.keywordMatch || 68}%
          </h3>

          <span className="text-orange-300 text-sm">
            Moderate
          </span>
        </div>

        <div className="mt-8 flex gap-2">

          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`
                h-3 w-3 rounded-full
                ${
                  dot <= 3
                    ? "bg-orange-300"
                    : "bg-white/10"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* SHORTLIST */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-gradient-to-br from-lime-400/[0.08] to-transparent backdrop-blur-2xl p-7">

        <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400/10 blur-[90px]" />

        <div className="relative">

          <p className="text-[11px] uppercase tracking-[0.24em] text-lime-300/60">
            Shortlist Probability
          </p>

          <div className="mt-8 flex items-end justify-between">

            <h3 className="text-5xl font-semibold">
              {shortlistProbability}%
            </h3>

            <TrendingUp className="w-6 h-6 text-lime-300" />
          </div>

          <p className="mt-5 text-sm text-white/45 leading-relaxed">
            Based on ATS compatibility
            and recruiter alignment.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AnalysisHeader