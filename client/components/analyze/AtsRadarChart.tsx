"use client";

import React from "react";
import { RadarChart, Radar, PolarAngleAxis, PolarGrid, ResponsiveContainer, PolarRadiusAxis } from "recharts";

export default function AtsRadarChart({ breakdown }: { breakdown: any }) {
  if (!breakdown) return null;

  const chartData = [
    { subject: "Keywords", score: Number(breakdown.keywordMatch ?? 0) },
    { subject: "Skills", score: Number(breakdown.skillsMatch ?? 0) },
    { subject: "Experience", score: Number(breakdown.experience ?? 0) },
    { subject: "Projects", score: Number(breakdown.projects ?? 0) },
    { subject: "Formatting", score: Number(breakdown.formatting ?? 0) },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Competency Map</h4>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">BETA v1.2</span>
      </div>
      
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }} 
            />
            <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
            <Radar
              name="ATS Profile"
              dataKey="score"
              stroke="#0F172A"
              strokeWidth={2}
              fill="#334155"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 border border-slate-100 rounded bg-slate-50/30">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Avg Score</p>
          <p className="text-sm font-bold text-slate-700">68.2</p>
        </div>
        <div className="p-2 border border-slate-100 rounded bg-slate-50/30">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Percentile</p>
          <p className="text-sm font-bold text-emerald-600">Top 12%</p>
        </div>
      </div>
    </div>
  );
}