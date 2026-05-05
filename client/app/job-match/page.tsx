"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  Briefcase,
  Zap,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JobCard } from "@/components/jobs/JobCard";
import { jobMatchingAPI } from "@/lib/api";

export default function JobMatchPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchPersonalizedJobs();
  }, []);

  const normalizeJobs = (jobs: any[]) => {
    return jobs.map((job) => ({
      ...job,
      title: job?.title || "Untitled Role",
      company: job?.company || "Unknown Company",
      matchScore: job?.matchScore || 0,
    }));
  };

  const fetchPersonalizedJobs = async (forceRefresh = false) => {
    try {
      setIsRefreshing(true);
      const result = await jobMatchingAPI.getPersonalizedJobs(forceRefresh);
      if (result.success) {
        setJobs(normalizeJobs(result.data.jobs || []));
        setUserProfile(result.data.userProfile);
        setCacheInfo(result.data.cacheInfo);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase();
    let filtered = jobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";
      const company = job?.company?.toLowerCase() || "";
      return title.includes(query) || company.includes(query);
    });

    if (sort === "best") {
      filtered = [...filtered].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [jobs, search, sort]);

  const avgScore =
    jobs.length > 0
      ? Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length)
      : 0;

  const bestScore =
    jobs.length > 0 ? Math.max(...jobs.map((j) => j.matchScore || 0)) : 0;

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fcfcfd]"
    >
      {/* COMMAND CENTER HEADER */}
      <header className="mt-10 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60">
  <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
    
    {/* ROW 1: HERO SECTION */}
    <div className="text-center space-y-2">
      <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
        AI-Powered Job Match
      </h1>
      <p className="max-w-2xl mx-auto text-md text-slate-500 leading-relaxed">
        Discover your personalized job matches, ranked by fit and relevance.
      </p>
    </div>

    {/* ROW 2: ACTION BAR & ENHANCED METRICS */}
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4">
      
      {/* IMPROVED METRICS (LEFT) */}
      <div className="flex items-center bg-slate-50/50 p-1 rounded-md border border-slate-100">
        {/* MATCH SCORE */}
        <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-200">
          <div className="relative flex items-center justify-center">
             <div className="w-10 h-10 rounded-full border-2 border-slate-200" />
             <span className="absolute text-[10px] font-bold text-indigo-600">{avgScore}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Match</span>
            <span className="text-sm font-semibold text-slate-700">Average Score</span>
          </div>
        </div>

        {/* ROLES COUNT */}
        <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-200">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total</span>
            <span className="text-sm font-semibold text-slate-700">{filteredJobs.length} Roles</span>
          </div>
        </div>

        {/* PROFILE COMPLETENESS */}
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Profile</span>
            <span className="text-sm font-semibold text-slate-700">{userProfile?.profileCompleteness ?? 0}% Ready</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS (RIGHT) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search matching jobs..."
            className="h-7 w-48 md:w-64 text-sm bg-transparent outline-none text-slate-700"
          />
          <div className="hidden md:block px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-400">
            ⌘K
          </div>
        </div>

        <div className="flex items-center gap-1">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 px-4 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 transition-colors"
          >
            <option value="best">Best Match</option>
            <option value="recent">Newest First</option>
          </select>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchPersonalizedJobs(true)}
            className="p-3 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </div>
      </div>

    </div>
  </div>
</header>
      {/* JOB GRID */}
      <main className="max-w-7xl mx-auto mt-12 px-6 py-8">
        {error ? (
          <div className="text-center py-20">{error}</div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id || i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <JobCard job={job} matchScore={job.matchScore} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

/* Skeleton */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#fcfcfd]">
    {/* HEADER SKELETON */}
    <div className="sticky top-[64px] bg-white border-b border-slate-200/60 z-30">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-9 w-64 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-md animate-pulse" />
        </div>

        {/* Metrics Bar & Search Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4">
          <div className="h-14 w-full lg:w-[450px] bg-slate-100/50 rounded-2xl border border-slate-100 animate-pulse" />
          <div className="flex gap-3">
            <div className="h-11 w-64 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-11 w-32 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    {/* JOB GRID SKELETON */}
    <main className="max-w-7xl mx-auto mt-12 px-6 py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-5 overflow-hidden relative"
          >
            {/* Shimmer Effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Card Header (Title & Match) */}
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-[80%] bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-[40%] bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>

            {/* Meta Info */}
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
            </div>

            {/* Description Lines */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-50 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-50 rounded animate-pulse" />
              <div className="h-3 w-[60%] bg-slate-50 rounded animate-pulse" />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-12 bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-11 flex-1 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);