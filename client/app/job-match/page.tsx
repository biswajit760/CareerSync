"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  Briefcase,
  Zap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    minSalary: 0,
    maxSalary: 50,
    experience: "all",
    jobType: "all",
    location: "all",
  });

  useEffect(() => {
    fetchPersonalizedJobs();
  }, []);

  const normalizeJobs = (jobs: any[]) => {
    return jobs.map((job) => ({
      ...job,
      title: job?.title || "Untitled Role",
      company: job?.company || "Unknown Company",
      matchScore: job?.matchScore || 0,
      salaryMin: job?.salaryMin || 0,
      salaryMax: job?.salaryMax || 0,
      location: job?.location || "India",
      jobType: job?.jobType || "Full-Time",
      postedDate: job?.postedDate || new Date().toISOString(),
    }));
  };

  const fetchPersonalizedJobs = async (forceRefresh = false) => {
    try {
      setIsRefreshing(true);

      const result = await jobMatchingAPI.getPersonalizedJobs(forceRefresh);

      if (result.success) {
        const rawJobs = Array.isArray(result.data)
          ? result.data
          : result.data?.jobs || [];

        setJobs(normalizeJobs(rawJobs));
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

    let result = jobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";
      const company = job?.company?.toLowerCase() || "";

      const matchesSearch =
        title.includes(query) || company.includes(query);

      const matchesScore =
        job.matchScore >= filters.minScore &&
        job.matchScore <= filters.maxScore;

      const matchesSalary =
        filters.maxSalary === 50 ||
        job.salaryMax === 0 ||
        job.salaryMax / 100000 <= filters.maxSalary;

      const seniority = job.scoreBreakdown?.seniorityAlignment || 0;

      const matchesExperience =
        filters.experience === "all"
          ? true
          : filters.experience === "fresher"
          ? seniority < 30
          : filters.experience === "junior"
          ? seniority >= 30 && seniority < 60
          : filters.experience === "mid"
          ? seniority >= 60 && seniority < 85
          : seniority >= 85;

      const matchesJobType =
        filters.jobType === "all" ||
        job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase());

      const matchesLocation =
        filters.location === "all" ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase());

      return (
        matchesSearch &&
        matchesScore &&
        matchesSalary &&
        matchesExperience &&
        matchesJobType &&
        matchesLocation
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "best") {
        if (b.matchScore === a.matchScore) {
          return (
            (b.scoreBreakdown?.growthPotential || 0) -
            (a.scoreBreakdown?.growthPotential || 0)
          );
        }

        return (b.matchScore || 0) - (a.matchScore || 0);
      }

      if (sort === "salary") {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }

      if (sort === "recent") {
        return (
          new Date(b.postedDate).getTime() -
          new Date(a.postedDate).getTime()
        );
      }

      return 0;
    });
  }, [jobs, search, sort, filters]);

  const avgScore =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length
        )
      : 0;

  const resetFilters = () => {
    setFilters({
      minScore: 0,
      maxScore: 100,
      minSalary: 0,
      maxSalary: 50,
      experience: "all",
      jobType: "all",
      location: "all",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) =>
      (typeof v === "number" &&
        v !== 0 &&
        v !== 100 &&
        v !== 50) ||
      (typeof v === "string" && v !== "all")
  ).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fcfcfd] overflow-x-hidden"
    >
      <header className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6 overflow-hidden">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium font-black tracking-tight text-slate-900">
              AI-Powered Job Match
            </h1>

            <p className="max-w-2xl mx-auto text-ex  text-slate-500">
              Personalized matches ranked by your specific skill alignment.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-stretch gap-5 w-full overflow-hidden">
  
  {/* ================= LEFT : METRICS ================= */}
  <div className="z-5 flex items-center bg-slate-50/50 p-1 rounded-md border border-slate-100">
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

  {/* ================= RIGHT : CONTROLS ================= */}
  <div className="xl:flex-[0.9] flex items-center gap-3 min-w-0">

    {/* Search */}
    <div className="group flex-1 min-w-0 flex items-center gap-3 h-14 px-4 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-300 transition-all duration-300">

      <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors shrink-0" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search jobs, companies..."
        className="w-full min-w-0 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
      />
    </div>

    {/* Buttons */}
    <div className="flex items-center gap-2 shrink-0">

      {/* Filter */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="relative h-14 w-14 shrink-0 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 shadow-sm"
      >
        <Filter className="w-5 h-5 mx-auto" />

        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-14 px-5 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl text-sm font-semibold text-slate-700 outline-none shadow-sm hover:border-emerald-200 transition-all duration-300"
      >
        <option value="best">Best Match</option>
        <option value="salary">Highest Salary</option>
        <option value="recent">Newest First</option>
      </select>

      {/* Refresh */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => fetchPersonalizedJobs(true)}
        className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 shadow-sm"
      >
        <RefreshCw
          className={`w-5 h-5 mx-auto ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </motion.button>

    </div>
  </div>
</div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-slate-200 space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">
                      Min Match Score
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minScore}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minScore: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />

                    <div className="text-xs text-slate-500">
                      {filters.minScore}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Max Salary LPA
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.maxSalary}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxSalary: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />

                    <div className="text-xs text-slate-500">
                      Up to ₹{filters.maxSalary}L
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Seniority
                    </label>

                    <select
                      value={filters.experience}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">
                      Job Type
                    </label>

                    <select
                      value={filters.jobType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          jobType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full h-[42px] px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-semibold text-slate-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 py-8 overflow-hidden">
        {error ? (
          <div className="text-center py-20 text-slate-500">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />

            <p className="text-slate-500 font-medium">
              No jobs match your current criteria
            </p>

            <button
              onClick={resetFilters}
              className="text-indigo-600 text-sm font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id || i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <JobCard
                  job={job}
                  matchScore={job.matchScore}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#fcfcfd] overflow-x-hidden">
    <div className="sticky top-0 bg-white border-b border-slate-200/60 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-9 w-64 bg-slate-200 rounded-lg animate-pulse" />

          <div className="h-4 w-96 max-w-full bg-slate-100 rounded-md animate-pulse" />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="h-36 flex-1 bg-slate-100 rounded-3xl animate-pulse" />

          <div className="flex gap-3">
            <div className="h-14 w-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-14 w-32 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-5 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-[80%] bg-slate-200 rounded" />
                <div className="h-5 w-[40%] bg-slate-200 rounded" />
              </div>

              <div className="h-10 w-10 bg-slate-100 rounded-lg" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-50 rounded" />
              <div className="h-3 w-[60%] bg-slate-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);