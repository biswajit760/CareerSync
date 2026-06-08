'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, Cell, Legend, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
  title: string;
  description?: string;
  data: any[];
  height?: number;
  loading?: boolean;
}

interface AreaChartProps extends ChartProps {
  dataKey: string;
  gradient?: boolean;
}

interface BarChartProps extends ChartProps {
  dataKey: string;
  layout?: 'vertical' | 'horizontal';
  colors?: string[];
}

interface RadarChartProps extends ChartProps {
  angleDataKey: string;
  dataKeys: { key: string; color: string }[];
}

const hoverCardProps = {
  whileHover: { y: -5 },
  transition: { type: 'spring' as const, stiffness: 300 },
};

/**
 * Area Chart Component
 */
export const DashboardAreaChart: React.FC<AreaChartProps> = ({
  title,
  description,
  data,
  dataKey,
  height = 300,
  gradient = true,
  loading = false,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-lime-400" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      {...hoverCardProps}
      className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      <div style={{ width: '100%', height: `${height}px`, minWidth: 0, minHeight: 0 }}>
        {mounted && (
          <ResponsiveContainer width="99%" height="100%" debounce={50}>
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {gradient && (
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#ffffff1a',
                  borderRadius: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#a3e635"
                strokeWidth={2}
                fill={gradient ? 'url(#colorScore)' : '#a3e635'}
                fillOpacity={gradient ? 1 : 0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Bar Chart Component
 */
export const DashboardBarChart: React.FC<BarChartProps> = ({
  title,
  description,
  data,
  dataKey,
  height = 300,
  layout = 'vertical',
  colors = ['#a3e635', '#10b981'],
  loading = false,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-lime-400" />
        </div>
      </div>
    );
  }

  const margin = layout === 'vertical'
    ? { top: 0, right: 0, left: -20, bottom: 0 }
    : { top: 10, right: 0, left: -20, bottom: 0 };

  return (
    <motion.div
      {...hoverCardProps}
      className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      <div style={{ width: '100%', height: `${height}px`, minWidth: 0, minHeight: 0 }}>
        {mounted && (
          <ResponsiveContainer width="99%" height="100%" debounce={50}>
            <BarChart
              data={data}
              layout={layout}
              margin={margin}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
              <XAxis type={layout === 'vertical' ? 'number' : 'category'} stroke="#a1a1aa" />
              <YAxis
                type={layout === 'vertical' ? 'category' : 'number'}
                stroke="#a1a1aa"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#ffffff1a',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} fill={colors[0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Radar Chart Component
 */
export const DashboardRadarChart: React.FC<RadarChartProps> = ({
  title,
  description,
  data,
  angleDataKey,
  dataKeys,
  height = 300,
  loading = false,
}) => {
  // Wait for Framer Motion's scale animation to finish before drawing the chart.
  // Recharts fails to calculate bounds if the parent is actively scaling.
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isReady) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
        </div>
        <div style={{ height: `${height}px` }} className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-lime-400" />
        </div>
      </div>
    );
  }

  // Fail-safe if no data is present
  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
        </div>
        <div style={{ height: `${height}px` }} className="flex items-center justify-center text-zinc-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      {...hoverCardProps}
      className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      
      {/* FIX: Give the parent a hard minHeight and relative positioning. */}
      <div className="relative w-full" style={{ height: `${height}px`, minHeight: `${height}px` }}>
        <div className="absolute inset-0">
          {/* FIX: Pass the explicit pixel height down to ResponsiveContainer 
            and use width="99%" to prevent ResizeObserver overflow bugs.
          */}
          <ResponsiveContainer width="99%" height={height} minWidth={1}>
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="75%" 
              data={data} 
            >
              <PolarGrid stroke="#ffffff1a" />
              <PolarAngleAxis dataKey={angleDataKey} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#ffffff1a',
                  borderRadius: '12px',
                }}
              />
              {dataKeys.map((dk) => (
                <Radar
                  key={dk.key}
                  name={dk.key}
                  dataKey={dk.key}
                  stroke={dk.color}
                  fill={dk.color}
                  fillOpacity={0.25}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Generic Chart Wrapper for flexibility
 */
export const DashboardChart: React.FC<ChartProps & { children: React.ReactNode }> = ({
  title,
  description,
  height = 300,
  loading = false,
  children,
}) => {
  if (loading) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-lime-400" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      {...hoverCardProps}
      className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl shadow-2xl"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      <div style={{ width: '100%', height: `${height}px`, minWidth: 0, minHeight: 0 }}>
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardChart;