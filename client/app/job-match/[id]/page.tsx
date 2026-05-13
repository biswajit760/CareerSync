"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { JobCard } from "@/components/jobs/JobCard";
import { ArrowLeft, CircleAlert, Search, Sparkles, Filter, X } from "lucide-react";

export default function JobMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const resumeId = resolvedParams.id;

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");
  
  // FIXED: Added missing filter state
  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    minSalary: 0,
    maxSalary: 50,
    jobType: "all",
    location: "all",
  });

  useEffect(() => {
    if (!resumeId || resumeId === "undefined") return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/jobs/recommendations/${resumeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.success) {
          const jobData = Array.isArray(result.data) 
            ? result.data 
            : (result.data?.jobs || []);
          
          setJobs(jobData);
          if (result.matchScore !== undefined) setMatchScore(result.matchScore);
        } else {
          setError(result.message || "Failed to fetch jobs");
        }
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [resumeId]);

  const filteredJobs = useMemo(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];
    const query = search.toLowerCase();

    // 1. FILTERING
    let result = safeJobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const matchesSearch = title.includes(query) || company.includes(query);

      const matchesScore =
        job.matchScore >= filters.minScore &&
        job.matchScore <= filters.maxScore;

      const matchesSalary =
        filters.maxSalary === 50 || 
        job.salaryMax === 0 ||      
        job.salaryMax / 100000 <= filters.maxSalary;

      const matchesJobType =
        filters.jobType === "all" ||
        (job.jobType || "").toLowerCase().includes(filters.jobType.toLowerCase());

      const matchesLocation =
        filters.location === "all" ||
        (job.location || "").toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesScore && matchesSalary && matchesJobType && matchesLocation;
    });

    // 2. SORTING
    return [...result].sort((a, b) => {
      if (sort === "best") return (b.matchScore || 0) - (a.matchScore || 0);
      if (sort === "salary") return (b.salaryMax || 0) - (a.salaryMax || 0);
      if (sort === "recent") {
        const dateA = new Date(a.postedDate || 0).getTime();
        const dateB = new Date(b.postedDate || 0).getTime();
        return dateB - dateA;
      }
      return 0;
    });
  }, [jobs, search, sort, filters]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                Your Job Matches <Sparkles className="w-6 h-6 text-blue-500 fill-blue-50" />
              </h1>
              <p className="text-slate-500 text-lg">Personalized roles based on your resume profile.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by role or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none"
              >
                <option value="best">Best Match</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
             <CircleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <p className="text-slate-600">{error}</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id || job._id || index}
                job={job}
                matchScore={job.matchScore || matchScore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border-2 border-dashed rounded-3xl">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No matches found</h3>
            <button 
              onClick={() => {setSearch(""); setFilters({minScore: 0, maxScore: 100, minSalary: 0, maxSalary: 50, jobType: "all", location: "all"})}}
              className="text-blue-600 mt-2 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Simple Skeleton Helper
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#f8fafc] p-8">
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-white rounded-2xl" />)}
      </div>
    </div>
  </div>
);