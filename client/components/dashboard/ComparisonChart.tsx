'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

interface ComparisonChartProps {
  data: {
    labels: string[];
    overallScores: number[];
    breakdowns: Array<{
      keywordMatch: number;
      skillsMatch: number;
      experience: number;
      projects: number;
      formatting: number;
    }>;
    jobTitles: string[];
    dates: string[];
  };
}

const lineConfig = [
  { key: 'overall',      color: '#10b981', label: 'Overall',      dot: 'bg-emerald-500' },
  { key: 'keywordMatch', color: '#3b82f6', label: 'Keywords',     dot: 'bg-blue-500'    },
  { key: 'skillsMatch',  color: '#f59e0b', label: 'Skills',       dot: 'bg-amber-500'   },
  { key: 'experience',   color: '#8b5cf6', label: 'Experience',   dot: 'bg-violet-500'  },
  { key: 'projects',     color: '#ec4899', label: 'Projects',     dot: 'bg-pink-500'    },
  { key: 'formatting',   color: '#06b6d4', label: 'Formatting',   dot: 'bg-cyan-500'    },
];

interface ChartDataPoint {
  name: string;
  overall: number;
  keywordMatch: number;
  skillsMatch: number;
  experience: number;
  projects: number;
  formatting: number;
  jobTitle: string;
  date: string;
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
    overall:      true,
    keywordMatch: true,
    skillsMatch:  false,
    experience:   false,
    projects:     false,
    formatting:   false,
  });

  const chartData: ChartDataPoint[] = data.labels.map((label, i) => ({
    name:         label,
    overall:      data.overallScores[i],
    keywordMatch: data.breakdowns[i]?.keywordMatch || 0,
    skillsMatch:  data.breakdowns[i]?.skillsMatch  || 0,
    experience:   data.breakdowns[i]?.experience   || 0,
    projects:     data.breakdowns[i]?.projects     || 0,
    formatting:   data.breakdowns[i]?.formatting   || 0,
    jobTitle:     data.jobTitles[i],
    date:         new Date(data.dates[i]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const toggle = (key: string) =>
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));

  const activeCount = Object.values(visibleLines).filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">

      {/* ── Card Header ── */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <BarChart2 className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Score Trends</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {data.labels.length} scan{data.labels.length !== 1 ? 's' : ''} · {activeCount} metric{activeCount !== 1 ? 's' : ''} visible
              </p>
            </div>
          </div>
        </div>

        {/* ── Toggle Pills ── */}
        <div className="flex flex-wrap gap-2 mt-5">
          {lineConfig.map(({ key, color, label, dot }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                visibleLines[key]
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
              style={visibleLines[key] ? { backgroundColor: color, borderColor: color } : {}}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${visibleLines[key] ? 'bg-white/70' : dot}`}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-2 pt-4 pb-5 bg-slate-50/50">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              {lineConfig.map(({ key, color }) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 2' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as ChartDataPoint;
                return (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 min-w-[190px]">
                    <div className="mb-3 pb-2.5 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{d.jobTitle} · {d.date}</p>
                    </div>
                    <div className="space-y-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {payload.map((entry: any, index: number) => (
                        <div key={`tooltip-${index}`} className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-slate-600">{entry.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-800 tabular-nums">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />

            {lineConfig.map(({ key, color, label }) =>
              visibleLines[key] ? (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#grad-${key})`}
                  dot={{ r: 3.5, fill: color, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: color, stroke: '#fff', strokeWidth: 2.5 }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}