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

  const fetchPersonalizedJobs = async (
    forceRefresh = false
  ) => {
    try {
      setIsRefreshing(true);

      const result =
        await jobMatchingAPI.getPersonalizedJobs(
          forceRefresh
        );

      if (result.success) {
        const rawJobs = Array.isArray(result.data)
          ? result.data
          : result.data?.jobs || [];

        setJobs(normalizeJobs(rawJobs));

        setUserProfile(result.data.userProfile);

        setError(null);
      } else {
        setError(
          result.message || "Failed to fetch jobs"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase();

    let result = jobs.filter((job) => {
      const title =
        job?.title?.toLowerCase() || "";

      const company =
        job?.company?.toLowerCase() || "";

      const matchesSearch =
        title.includes(query) ||
        company.includes(query);

      const matchesScore =
        job.matchScore >= filters.minScore &&
        job.matchScore <= filters.maxScore;

      const matchesSalary =
        filters.maxSalary === 50 ||
        job.salaryMax === 0 ||
        job.salaryMax / 100000 <=
          filters.maxSalary;

      const seniority =
        job.scoreBreakdown
          ?.seniorityAlignment || 0;

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
        job.jobType
          ?.toLowerCase()
          .includes(
            filters.jobType.toLowerCase()
          );

      const matchesLocation =
        filters.location === "all" ||
        job.location
          ?.toLowerCase()
          .includes(
            filters.location.toLowerCase()
          );

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
        if (
          b.matchScore === a.matchScore
        ) {
          return (
            (b.scoreBreakdown
              ?.growthPotential || 0) -
            (a.scoreBreakdown
              ?.growthPotential || 0)
          );
        }

        return (
          (b.matchScore || 0) -
          (a.matchScore || 0)
        );
      }

      if (sort === "salary") {
        return (
          (b.salaryMax || 0) -
          (a.salaryMax || 0)
        );
      }

      if (sort === "recent") {
        return (
          new Date(
            b.postedDate
          ).getTime() -
          new Date(
            a.postedDate
          ).getTime()
        );
      }

      return 0;
    });
  }, [jobs, search, sort, filters]);

  const avgScore =
    jobs.length > 0
      ? Math.round(
          jobs.reduce(
            (acc, j) =>
              acc + (j.matchScore || 0),
            0
          ) / jobs.length
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

  const activeFilterCount =
    Object.values(filters).filter(
      (v) =>
        (typeof v === "number" &&
          v !== 0 &&
          v !== 100 &&
          v !== 50) ||
        (typeof v === "string" &&
          v !== "all")
    ).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        min-h-screen
        bg-black
        relative
        overflow-x-hidden
        font-manrope
        text-white
      "
    >

      {/* ================================================= */}
      {/* CINEMATIC BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_35%)]" />

      <div className="absolute left-[-10%] top-[10%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="absolute right-[-10%] bottom-[0%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full pointer-events-none" />

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          mix-blend-soft-light
          pointer-events-none
        "
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header
        className="
          sticky
          top-0
          z-40
          bg-black/40
          backdrop-blur-3xl
          border-b
          border-white/[0.06]
          mt-16
        "
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 py-10">

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <div className="text-center">

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-2.5
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.03]
                backdrop-blur-2xl
              "
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 animate-ping"></span>

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />
              </div>

              <span className="text-sm tracking-wide text-white/70">
                AI Career Intelligence
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                mt-8
                text-[48px]
                md:text-[72px]
                leading-[0.95]
                tracking-[-0.07em]
                font-[550]
              "
            >
              AI-Powered{"  "}

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
                Job Match
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl mx-auto text-md leading-relaxed text-white/40">
              Personalized opportunities ranked
              using your resume, ATS compatibility,
              technical skills, and growth
              potential.
            </p>
          </div>

          {/* ================================================= */}
          {/* SEARCH + FILTERS */}
          {/* ================================================= */}

         {/* ================================================= */}
{/* UNIFIED AI CONTROL BAR */}
{/* ================================================= */}

<div
  className="
  
    mt-12
    relative
    rounded-[2.5rem]
    border
    border-white/[0.06]
    bg-white/[0.03]
    backdrop-blur-3xl
    z-10
  "
>

  {/* Ambient Glow */}
  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_left,rgba(163,230,53,0.08),transparent_35%)]
      pointer-events-none
      rounded-[2.5rem]
    "
  />

  <div
    className="
      relative
      grid
      grid-cols-1
      xl:grid-cols-[auto_1fr]
      gap-6
      p-5
      items-center
     -z-10
     rounded-[2.5rem]
    "
  >

    {/* ================================================= */}
    {/* LEFT METRICS */}
    {/* ================================================= */}

    <div
      className="
        flex
        items-center
        gap-4
        flex-nowrap
      "
    >

      {/* ================================================= */}
      {/* AVERAGE MATCH */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          gap-4
          px-5
          py-4
          rounded-[1.8rem]
          border
          border-white/[0.05]
          bg-black/20
          min-w-[200px]
          h-[110px]
          relative
          overflow-hidden
        "
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-lime-400/[0.03] " />

        {/* Ring */}
        <div className="relative w-12 h-12 shrink-0">

          <svg
            className="w-12 h-12 rotate-[-90deg]"
            viewBox="0 0 100 100"
          >
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              fill="none"
            />

            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#a3e635"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${avgScore * 2.64} 999`}
              className="drop-shadow-[0_0_10px_rgba(163,230,53,0.7)]"
            />
          </svg>

          {/* Percentage */}
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              text-xs
              font-semibold
              text-white
            "
          >
            {avgScore}%
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
            Average Match
          </p>

          <p className="mt-1 text-md font-semibold tracking-tight text-white">
            Strong Alignment
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MATCHED ROLES */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          gap-4
          px-5
          py-4
          rounded-[1.8rem]
          border
          border-white/[0.05]
          bg-black/20
          min-w-[200px]
          h-[110px]
          relative
          overflow-hidden
        "
      >

        <div className="absolute inset-0 bg-lime-400/[0.02]" />

        {/* Icon */}
        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-lime-400/10
            border
            border-lime-400/20
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <Briefcase className="w-5 h-5 text-lime-300" />
        </div>

        {/* Text */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
            Matched Roles
          </p>

          <p className="mt-1 text-lg font-semibold tracking-tight text-white">
            {filteredJobs?.length || 0}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* PROFILE STATUS */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          gap-4
          px-5
          py-4
          rounded-[1.8rem]
          border
          border-white/[0.05]
          bg-black/20
          min-w-[200px]
          h-[110px]
          relative
          overflow-hidden
        "
      >

        <div className="absolute inset-0 bg-emerald-400/[0.03]" />

        {/* Icon */}
        <div
          className="
            relative
            w-12
            h-12
            rounded-2xl
            bg-emerald-400/10
            border
            border-emerald-400/20
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <div className="absolute inset-0 bg-emerald-400/10 blur-xl" />

          <Zap className="w-5 h-5 text-emerald-300 relative z-10" />
        </div>

        {/* Text */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
            Profile Status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              {userProfile?.profileCompleteness || 0}%
            </span>

            <span
              className="
                px-2.5
                py-1
                rounded-full
                bg-emerald-400/10
                border
                border-emerald-400/20
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-emerald-300
              "
            >
              Optimized
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* ================================================= */}
    {/* RIGHT CONTROLS */}
    {/* ================================================= */}

    <div
      className="
        flex
        items-center
        gap-4
        w-full
        min-w-0
      "
    >

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div
        className="
          relative
          flex
          items-center
          flex-[1.2]
          min-w-[320px]
          h-[72px]
          rounded-[1.8rem]
          border
          border-white/[0.05]
          bg-black/20
          px-6
          overflow-hidden
        "
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-lime-400/[0.05] to-transparent" />

        <Search className="w-5 h-5 text-white/30 relative z-10 shrink-0" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs, frameworks, companies..."
          className="
            w-full
            bg-transparent
            px-4
            text-white
            placeholder:text-white/25
            outline-none
            relative
            z-10
          "
        />
      </div>

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="
          relative
          h-[72px]
          w-[72px]
          shrink-0
          rounded-[1.8rem]
          border
          border-white/[0.05]
          bg-black/20
          text-white/50
          hover:text-lime-300
          hover:border-lime-400/20
          hover:bg-lime-400/[0.04]
          transition-all
          duration-300
        "
      >
        <Filter className="w-5 h-5 mx-auto" />
      </button>

      {/* ================================================= */}
      {/* SORT */}
      {/* ================================================= */}

      <div
        className="
          relative
          min-w-[220px]
        "
      >
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="
            appearance-none
            w-full
            h-[72px]
            rounded-[1.8rem]
            border
            border-white/[0.05]
            bg-black/20
            px-6
            pr-14
            text-white
            outline-none
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-lime-400/20
          "
        >
          <option value="best">Best Match</option>
          <option value="salary">Highest Salary</option>
          <option value="recent">Newest First</option>
        </select>

        {/* Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            text-white/50
            text-sm
          "
        >
          ▼
        </div>
      </div>

      {/* ================================================= */}
      {/* REFRESH */}
      {/* ================================================= */}

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => fetchPersonalizedJobs(true)}
        className="
          h-[72px]
          w-[72px]
          shrink-0
          rounded-[1.8rem]
          border
          border-lime-400/20
          bg-lime-400/[0.05]
          text-lime-300
          hover:bg-lime-400/[0.12]
          hover:shadow-[0_0_25px_rgba(163,230,53,0.2)]
          transition-all
          duration-300
        "
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

          {/* ================================================= */}
          {/* FILTER PANEL */}
          {/* ================================================= */}

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="
                  mt-6
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  backdrop-blur-3xl
                  p-6
                "
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

                  {/* MATCH SCORE */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.15em] text-white/40">
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
                          minScore:
                            parseInt(
                              e.target.value
                            ),
                        })
                      }
                      className="w-full accent-lime-400"
                    />

                    <div className="text-xs text-lime-300">
                      {filters.minScore}%
                    </div>
                  </div>

                  {/* SALARY */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.15em] text-white/40 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Max Salary
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.maxSalary}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxSalary:
                            parseInt(
                              e.target.value
                            ),
                        })
                      }
                      className="w-full accent-lime-400"
                    />

                    <div className="text-xs text-lime-300">
                      Up to ₹
                      {filters.maxSalary}L
                    </div>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.15em] text-white/40 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Experience
                    </label>

                    <select
                      value={filters.experience}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          experience:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        h-12
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-black/40
                        px-4
                        text-white
                        outline-none
                      "
                    >
                      <option value="all">
                        All Levels
                      </option>

                      <option value="fresher">
                        Fresher
                      </option>

                      <option value="junior">
                        Junior
                      </option>

                      <option value="mid">
                        Mid-Level
                      </option>

                      <option value="senior">
                        Senior
                      </option>
                    </select>
                  </div>

                  {/* JOB TYPE */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-[0.15em] text-white/40">
                      Job Type
                    </label>

                    <select
                      value={filters.jobType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          jobType:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        h-12
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-black/40
                        px-4
                        text-white
                        outline-none
                      "
                    >
                      <option value="all">
                        All Types
                      </option>

                      <option value="full-time">
                        Full-Time
                      </option>

                      <option value="part-time">
                        Part-Time
                      </option>

                      <option value="contract">
                        Contract
                      </option>
                    </select>
                  </div>

                  {/* RESET */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="
                        w-full
                        h-12
                        rounded-2xl
                        bg-lime-400
                        text-black
                        font-semibold
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                        shadow-[0_0_30px_rgba(163,230,53,0.25)]
                      "
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

      {/* ================================================= */}
      {/* JOB GRID */}
      {/* ================================================= */}

      <main className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 py-10">

        {error ? (
          <div
            className="
              text-center
              py-20
              rounded-3xl
              border
              border-red-500/20
              bg-red-500/10
              text-red-400
            "
          >
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div
            className="
              text-center
              py-24
              rounded-3xl
              border
              border-white/[0.04]
              bg-white/[0.03]
              backdrop-blur-sm
            "
          >
            <Briefcase className="w-14 h-14 text-white/15 mx-auto" />

            <p className="mt-6 text-white/45 text-lg">
              No jobs match your filters.
            </p>

            <button
              onClick={resetFilters}
              className="
                mt-8
                px-6
                py-3
                rounded-full
                bg-lime-400
                text-black
                font-semibold
                hover:bg-lime-300
                transition-all
              "
            >
              Reset Filters
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
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-14
            "
          >
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id || i}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
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
  <div className="min-h-screen bg-black overflow-hidden relative">

    <div className="absolute left-[-10%] top-[10%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full" />

    <div className="absolute right-[-10%] bottom-[0%] w-[600px] h-[600px] bg-lime-400/10 blur-[160px] rounded-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">

      <div className="flex flex-col items-center space-y-5">

        <div className="h-14 w-96 bg-white/10 rounded-2xl animate-pulse" />

        <div className="h-5 w-[500px] max-w-full bg-white/[0.05] rounded-xl animate-pulse" />
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
              rounded-3xl
              border
              border-white/[0.04]
              bg-white/[0.03]
              backdrop-blur-sm
              p-6
              space-y-5
              animate-pulse
            "
          >
            <div className="flex justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-[70%] bg-white/10 rounded-lg" />

                <div className="h-4 w-[40%] bg-white/[0.05] rounded-lg" />
              </div>

              <div className="h-12 w-12 bg-white/10 rounded-2xl" />
            </div>

            <div className="space-y-3 pt-4">
              <div className="h-3 w-full bg-white/[0.05] rounded-md" />

              <div className="h-3 w-[60%] bg-white/[0.05] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);