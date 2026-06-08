'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import {
  Sparkles, FileText, ChevronRight, ArrowRight,
  Zap, Plus, Crosshair, BriefcaseBusiness, Flame,
  TrendingDown, Trophy, Brain, Gauge, Bookmark, Activity,
  AlertCircle, CheckCircle, InfoIcon, Loader2
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { DashboardAreaChart, DashboardBarChart, DashboardRadarChart } from '@/components/dashboard/DashboardChart';
import useDashboardData from '@/lib/useDashboardData';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 120, damping: 20 } }
};

const hoverCardProps = {
  whileHover: { y: -5, scale: 1.01 },
  transition: { type: 'spring' as const, stiffness: 300 }
};

export default function CareerSyncDashboard() {
  const { data, loading, error, refreshData } = useDashboardData();
  const [timePeriod, setTimePeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');

  // Get first name for greeting
  const firstName = data?.userInfo.name.split(' ')[0] || 'there';
  
  // Format ATS score with trend
  const atsScoreTrend = data?.stats.weeklyGrowth || 0;
  const atsScoreTrendDir = atsScoreTrend > 0 ? 'up' : atsScoreTrend < 0 ? 'down' : 'stable';

  // Calculate percentile
  const percentile = data?.stats.atsScore ? Math.round((data.stats.atsScore / 100) * 100) : 0;

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans flex items-center justify-center">
        <div className="rounded-3xl bg-zinc-900/40 border border-red-500/20 p-8 backdrop-blur-xl max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={24} className="text-red-400" />
            <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
          </div>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-lime-500/30 overflow-hidden relative pb-20">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 blur-[180px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] bg-emerald-600/10 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[30%] h-[40%] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
          
          {/* --- HERO HEADER --- */}
          <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5 relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-500/20 to-transparent" />
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="flex items-center gap-3 mb-4"
              >
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest bg-lime-500/10 text-lime-400 border border-lime-500/20 shadow-[0_0_15px_rgba(163,230,53,0.15)] mt-16">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                  AI Engine Online
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-3 drop-shadow-lg">
                Good evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400">{loading ? 'there' : firstName}</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-lg max-w-2xl font-light">
                Your resume scored a <strong className="text-lime-400 font-semibold drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">{loading ? '...' : data?.stats.atsScore}/100</strong>. 
                {!loading && data && (
                  <>
                    You are in the top <strong>{100 - percentile}%</strong> of applicants for your target roles.
                  </>
                )}
              </p>
            </div>

            <Link href="/analyze">
              <button
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-5
                  pl-7
                  pr-2
                  py-2
                  rounded-full
                  bg-white
                  text-black
                  transition-all
                  duration-300
                  hover:scale-[1.015]
                  hover:shadow-[0_0_40px_rgba(163,230,53,0.16)]
                "
              >
                {/* Text */}
                <span className="text-[15px] font-[600] tracking-[-0.02em]">
                  New Scan
                </span>
              
                {/* Arrow Circle */}
                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#A3E635]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    group-hover:-rotate-45
                    cursor-pointer
                  "
                >
                  <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
              
                {/* Soft Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                    blur-2xl
                    bg-[#A3E635]/10
                    -z-10
                  "
                />
              </button>
            </Link>
          </motion.header>

          {/* --- QUICK STATS ROW --- */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="ATS Score"
              value={`${loading ? '...' : data?.stats.atsScore}%`}
              description={loading ? 'Loading...' : `${atsScoreTrend > 0 ? '+' : ''}${atsScoreTrend}% this week`}
              icon={Trophy}
              color="text-lime-400"
              backgroundColor="bg-lime-400/10"
              borderColor="group-hover:border-lime-500/30"
              trend={!loading && data ? { direction: atsScoreTrendDir, percentage: Math.abs(atsScoreTrend) } : undefined}
              loading={loading}
            />
            <StatCard
  title="Saved Leads"
  // Added fallback ?? 0 here
  value={loading ? '...' : (data?.stats.savedLeads ?? 0)} 
  description={loading ? 'Loading...' : `${Math.max(0, (data?.stats.savedLeads || 0) - 2)} new matches`}
  icon={Bookmark}
  color="text-emerald-400"
  backgroundColor="bg-emerald-400/10"
  borderColor="group-hover:border-emerald-500/30"
  loading={loading}
/>

<StatCard
  title="AI Scans"
  // Added fallback ?? 0 here
  value={loading ? '...' : (data?.stats.aiScans ?? 0)} 
  // Added fallback ?? 0 here to prevent "undefined this month"
  description={loading ? 'Loading...' : `${data?.stats.scansThisMonth ?? 0} this month`} 
  icon={Activity}
  color="text-cyan-400"
  backgroundColor="bg-cyan-400/10"
  borderColor="group-hover:border-cyan-500/30"
  loading={loading}
/>
            <StatCard
              title="Market Fit"
              value={`${loading ? '...' : data?.stats.marketFit}%`}
              description={loading ? 'Loading...' : 'Top percentile'}
              icon={Gauge}
              color="text-purple-400"
              backgroundColor="bg-purple-400/10"
              borderColor="group-hover:border-purple-500/30"
              loading={loading}
            />
          </motion.section>

          {/* --- TOP VISUAL DATA SECTION --- */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Skill Radar Chart */}
            <DashboardRadarChart
              title="Skill Topology"
              description="Your profile vs. market expectations for target roles"
              data={data?.skillRadarData || []}
              angleDataKey="skill"
              dataKeys={[
                { key: 'user', color: '#a3e635' },
                { key: 'market', color: '#52525b' }
              ]}
              height={280}
              loading={loading}
            />

            {/* ATS Benchmark Comparison */}
            <DashboardBarChart
              title="ATS Telemetry"
              description="Micro-metrics vs. successfully hired candidates"
              data={data?.atsBenchmark || []}
              dataKey="score"
              layout="vertical"
              colors={['#a3e635', '#f59e0b']}
              height={280}
              loading={loading}
            />
          </motion.section>

          {/* --- MAIN DASHBOARD GRID --- */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Performance Trajectory */}
              <DashboardAreaChart
                title="Performance Trajectory"
                description="Historical ATS pass rate tracking across all versions"
                data={data?.performanceTrajectory || []}
                dataKey="score"
                height={300}
                gradient={true}
                loading={loading}
              />

              {/* Saved Jobs Section */}
              <motion.div {...hoverCardProps} className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      Saved Jobs
                      <span className="bg-lime-500/20 text-lime-400 text-xs py-1 px-2.5 rounded-lg border border-lime-500/20">
                        {loading ? '...' : data?.savedJobsList?.length || 0} Active
                      </span>
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">Tracked opportunities and your resume match scores.</p>
                  </div>
                  <Link href="/job-match">
                    <button className="text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                      View all jobs <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin text-lime-400" size={32} />
                    </div>
                  ) : data?.savedJobsList && data.savedJobsList.length > 0 ? (
                    data.savedJobsList.slice(0, 5).map((job) => (
                      <motion.div whileHover={{ scale: 1.01 }} key={job.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-white/5 bg-black/40 hover:bg-black/60 transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xl font-bold text-white border border-white/10 shadow-inner">
                            {job.logo}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{job.role}</h4>
                            <p className="text-sm text-zinc-400 mt-0.5">{job.company} • <span className="text-zinc-500">{job.location}</span></p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0 border-t border-white/5 md:border-none pt-4 md:pt-0">
                          <div className="text-left md:text-right">
                            <p className="text-sm font-medium text-zinc-300">{job.salary}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{job.date}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lime-400 font-black text-xl">{Math.round(job.match)}%</span>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Match</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark size={32} className="mx-auto text-zinc-600 mb-3" />
                      <p className="text-zinc-400">No saved jobs yet. Start exploring opportunities!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* ATS Breakdown */}
              <motion.div {...hoverCardProps} className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-6">Score Breakdown</h3>
                <div className="space-y-5">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-lime-400" />
                    </div>
                  ) : (
                    data?.atsBreakdown?.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-300">{item.name}</span>
                          <span className="text-white font-bold">{item.value}</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div {...hoverCardProps} className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Brain size={20} className="text-lime-400" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-lime-400" />
                    </div>
                  ) : data?.insights && data.insights.length > 0 ? (
                    data.insights.slice(0, 3).map((insight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border-l-4 bg-black/40 ${
                          insight.type === 'success'
                            ? 'border-l-lime-400 bg-lime-400/5'
                            : insight.type === 'warning'
                            ? 'border-l-yellow-400 bg-yellow-400/5'
                            : 'border-l-blue-400 bg-blue-400/5'
                        }`}
                      >
                        <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                        <p className="text-xs text-zinc-400">{insight.description}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">No insights available yet</p>
                  )}
                </div>
              </motion.div>

              {/* Last Updated */}
              <motion.div {...hoverCardProps} className="rounded-3xl bg-zinc-900/40 border border-white/5 p-4 backdrop-blur-xl text-center">
                <p className="text-xs text-zinc-500">
                  Last updated: {loading ? 'Loading...' : new Date(data?.lastUpdated || new Date()).toLocaleString()}
                </p>
                <button
                  onClick={refreshData}
                  className="mt-3 w-full px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Refresh Data
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Weekly Applications Chart */}
          <motion.div variants={itemVariants} className="rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-6">Weekly Activity</h3>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <Loader2 className="animate-spin text-lime-400" size={32} />
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.weeklyApplications || []} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                    <XAxis dataKey="day" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="#a3e635" radius={[8, 8, 0, 0]}>
                      {data?.weeklyApplications?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.value > 3 ? '#a3e635' : '#52525b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}