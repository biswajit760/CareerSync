"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { JobCard } from "@/components/jobs/JobCard";

import {
  ArrowLeft,
  CircleAlert,
  Search,
  Sparkles,
  Filter,
  Briefcase,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function JobMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const resumeId = resolvedParams.id;

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [matchScore, setMatchScore] =
    useState<number>(0);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");

  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    minSalary: 0,
    maxSalary: 50,
    jobType: "all",
    location: "all",
  });

  useEffect(() => {
    if (
      !resumeId ||
      resumeId === "undefined"
    )
      return;

    const fetchJobs = async () => {
      setLoading(true);

      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/jobs/recommendations/${resumeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.success) {
          const jobData = Array.isArray(
            result.data
          )
            ? result.data
            : result.data?.jobs || [];

          setJobs(jobData);

          if (
            result.matchScore !== undefined
          ) {
            setMatchScore(
              result.matchScore
            );
          }
        } else {
          setError(
            result.message ||
              "Failed to fetch jobs"
          );
        }
      } catch {
        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [resumeId]);

  const filteredJobs = useMemo(() => {
    const safeJobs = Array.isArray(jobs)
      ? jobs
      : [];

    const query = search.toLowerCase();

    let result = safeJobs.filter(
      (job) => {
        const title = (
          job.title || ""
        ).toLowerCase();

        const company = (
          job.company || ""
        ).toLowerCase();

        const matchesSearch =
          title.includes(query) ||
          company.includes(query);

        const matchesScore =
          job.matchScore >=
            filters.minScore &&
          job.matchScore <=
            filters.maxScore;

        const matchesSalary =
          filters.maxSalary === 50 ||
          job.salaryMax === 0 ||
          job.salaryMax / 100000 <=
            filters.maxSalary;

        const matchesJobType =
          filters.jobType === "all" ||
          (
            job.jobType || ""
          )
            .toLowerCase()
            .includes(
              filters.jobType.toLowerCase()
            );

        const matchesLocation =
          filters.location === "all" ||
          (
            job.location || ""
          )
            .toLowerCase()
            .includes(
              filters.location.toLowerCase()
            );

        return (
          matchesSearch &&
          matchesScore &&
          matchesSalary &&
          matchesJobType &&
          matchesLocation
        );
      }
    );

    return [...result].sort((a, b) => {
      if (sort === "best") {
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
        const dateA = new Date(
          a.postedDate || 0
        ).getTime();

        const dateB = new Date(
          b.postedDate || 0
        ).getTime();

        return dateB - dateA;
      }

      return 0;
    });
  }, [jobs, search, sort, filters]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div
      className="
        min-h-screen
        bg-[#030303]
        text-white
        relative
        overflow-hidden
      "
    >
      {/* ========================================= */}
      {/* BACKGROUND */}
      {/* ========================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_35%)]" />

      <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-lime-400/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-lime-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* ========================================= */}
{/* HERO */}
{/* ========================================= */}

<header
  className="
    relative
    z-20
    overflow-hidden
    border-b
    border-white/[0.05]
    bg-black
  "
>

  {/* Ambient Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_35%)]" />

  <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-lime-400/10 blur-[180px] rounded-full pointer-events-none" />

  <div className="absolute bottom-[-30%] right-[-10%] w-[700px] h-[700px] bg-lime-500/5 blur-[180px] rounded-full pointer-events-none" />

  <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10">

    {/* ========================================= */}
    {/* HEADING */}
    {/* ========================================= */}

    <div className="max-w-4xl mx-auto text-center">

      {/* Badge */}

      <div
        className="
          inline-flex
          items-center
          gap-3
          px-5
          py-2
          rounded-full
          border
          border-lime-400/15
          bg-lime-400/[0.05]
          backdrop-blur-xl
          mb-8
        "
      >
        <Sparkles className="w-4 h-4 text-lime-300" />

        <span className="text-[11px] uppercase tracking-[0.22em] text-lime-300">
          AI Career Intelligence
        </span>
      </div>

      {/* Heading */}

      <h1
        className="
          text-5xl
          md:text-6xl
          lg:text-7xl
          font-semibold
          tracking-[-0.06em]
          leading-[0.92]
        "
      >
        Personalized
        <br />

        <span className="bg-gradient-to-r from-white via-lime-100 to-lime-400 bg-clip-text text-transparent">
          Job Matches
        </span>
      </h1>

      {/* Description */}

      <p
        className="
          mt-8
          text-lg
          leading-relaxed
          text-white/45
          max-w-2xl
          mx-auto
        "
      >
        AI-ranked opportunities based on your resume,
        ATS compatibility, technical skills,
        and hiring alignment.
      </p>
    </div>

    {/* ========================================= */}
    {/* UNIFIED CONTROL BAR */}
    {/* ========================================= */}

    <div
      className="
        relative
        mt-14
        rounded-[32px]
        border
        border-white/[0.06]
        bg-white/[0.03]
        backdrop-blur-3xl
        overflow-hidden
        p-5
      "
    >

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(163,230,53,0.08),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(163,230,53,0.05),transparent_30%)]" />

      <div
        className="
          relative
          flex
          flex-col
          xl:flex-row
          gap-5
          items-center
        "
      >

        {/* SEARCH */}

        <div
          className="
            relative
            flex-1
            w-full
            h-[76px]
            rounded-[26px]
            border
            border-white/[0.06]
            bg-black/25
            overflow-hidden
            flex
            items-center
            px-7
          "
        >

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/[0.06] via-transparent to-transparent" />

          <Search className="w-5 h-5 text-lime-300/60 relative z-10 shrink-0" />

          <input
            type="text"
            placeholder="Search jobs, companies, frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-transparent
              px-5
              text-white
              text-[15px]
              placeholder:text-white/25
              outline-none
              relative
              z-10
            "
          />
        </div>

        {/* CONTROLS */}

        <div
          className="
            flex
            items-center
            gap-4
            w-full
            xl:w-auto
          "
        >

          {/* FILTER */}

          <button
            className="
              relative
              h-[76px]
              w-[76px]
              rounded-[24px]
              border
              border-white/[0.06]
              bg-black/25
              flex
              items-center
              justify-center
              overflow-hidden
              transition-all
              duration-300
              hover:border-lime-400/20
              hover:bg-lime-400/[0.04]
            "
          >

            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.08),transparent_70%)]" />

            <Filter className="w-5 h-5 text-white/50 hover:text-lime-300 transition-colors relative z-10" />
          </button>

          {/* SORT */}

          <div className="relative min-w-[240px]">

            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-lime-400/[0.03] to-transparent pointer-events-none" />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
                appearance-none
                relative
                w-full
                h-[76px]
                rounded-[24px]
                border
                border-white/[0.06]
                bg-black/25
                px-7
                pr-16
                text-white
                outline-none
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-lime-400/20
              "
            >
              <option value="best">
                Best Match
              </option>

              <option value="recent">
                Most Recent
              </option>

              <option value="salary">
                Highest Salary
              </option>
            </select>

            <div
              className="
                absolute
                right-6
                top-1/2
                -translate-y-1/2
                text-white/40
                pointer-events-none
              "
            >
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

{/* ========================================= */}
{/* JOB GRID SECTION */}
{/* ========================================= */}

<main className="relative overflow-hidden">

  {/* Cinematic Background Glow */}

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.05),transparent_30%)]" />

  <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-lime-400/5 blur-[160px] rounded-full pointer-events-none" />

  <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-lime-500/5 blur-[180px] rounded-full pointer-events-none" />

  {/* Grid Texture */}

  <div
    className="absolute inset-0 opacity-[0.02] pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
    }}
  />

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

    {/* JOB GRID */}

    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-8
      "
    >
      {filteredJobs.map((job, index) => (
        <motion.div
          key={job.id || job._id || index}
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
            matchScore={
              job.matchScore || matchScore
            }
          />
        </motion.div>
      ))}
    </motion.div>
  </div>
</main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#030303] overflow-hidden relative">

    <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-lime-400/10 blur-[180px] rounded-full" />

    <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-lime-500/5 blur-[180px] rounded-full" />

    <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">

      <div className="h-16 w-[420px] bg-white/[0.05] rounded-2xl" />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

        {[1, 2, 3, 4, 5, 6].map(
          (i) => (
            <div
              key={i}
              className="
                h-[420px]
                rounded-[32px]
                border
                border-white/[0.04]
                bg-white/[0.03]
                backdrop-blur-sm
              "
            />
          )
        )}
      </div>
    </div>
  </div>
);