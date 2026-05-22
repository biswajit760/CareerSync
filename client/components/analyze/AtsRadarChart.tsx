"use client";

import React, { useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";

export default function AtsRadarChart({ breakdown }: { breakdown: Record<string, unknown> | null }) {
  if (!breakdown) return null;

  const chartData = [
    { subject: "Keywords", score: Number((breakdown.keywordMatch as number | undefined) ?? 0) },
    { subject: "Skills", score: Number((breakdown.technicalSkills as number | undefined) ?? (breakdown.skillsMatch as number | undefined) ?? 0) },
    { subject: "Experience", score: Number((breakdown.experienceStrength as number | undefined) ?? (breakdown.experience as number | undefined) ?? 0) },
    { subject: "Projects", score: Number((breakdown.projectQuality as number | undefined) ?? (breakdown.projects as number | undefined) ?? 0) },
    { subject: "Formatting", score: Number((breakdown.formatting as number | undefined) ?? 0) },
  ];

  // 🔥 Dynamic Avg Score
  const chartMemoData = useMemo(() => {
    const total = chartData.reduce((acc, item) => acc + item.score, 0);
    return {
      avg: (total / chartData.length).toFixed(1),
      data: chartData,
    };
  }, [chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
          Competency Map
        </h4>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
          BETA v1.2 - Score: {chartMemoData.avg}
        </span>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            
            {/* Softer Grid */}
            <PolarGrid stroke="#E2E8F0" strokeOpacity={0.5} />

            {/* Labels */}
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#64748B",
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

            {/* Gradient */}
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Radar */}
            <Radar
              name="ATS Profile"
              dataKey="score"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#radarGradient)"
              fillOpacity={1}
              dot={{
                r: 3,
                fill: "#6366F1",
                strokeWidth: 0,
              }}
              style={{
                filter: "drop-shadow(0 0 6px rgba(99,102,241,0.35))",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Center Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
        </div>
      </div>

      
    </motion.div>
  );
}