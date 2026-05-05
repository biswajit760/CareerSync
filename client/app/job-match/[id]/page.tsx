"use client";

import { useState, useEffect, useMemo, use } from "react";
import { Sparkles, ArrowLeft, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/jobs/JobCard";

export default function JobMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const resumeId = resolvedParams.id;

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");

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
          setJobs(result.data);
          if (result.matchScore !== undefined) {
            setMatchScore(result.matchScore);
          }
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

  // 🔥 Derived Data Logic
  const filteredJobs = useMemo(() => {
    
    let filtered = jobs.filter((job) =>
      (job.title ?? '').toLowerCase().includes(search.toLowerCase())
    );    if (sort === "best") {
      filtered = [...filtered].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sort === "recent") {
      // Assuming you have a date field, otherwise this falls back to original order
    } else if (sort === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }    return filtered;
  }, [jobs, search, sort]);

  const avgScore =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length
        )
      : 0;

  const bestScore =
    jobs.length > 0
      ? Math.max(...jobs.map((j) => j.matchScore || 0))
      : 0;

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 🔥 HEADER SECTION */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Breadcrumb / Back Navigation */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          {/* Main Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            
            {/* LEFT: Title & Key Stats */}
            <div className="flex-1">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  Your Job Matches
                  <Sparkles className="w-6 h-6 text-blue-500 fill-blue-50" />
                </h1>
                <p className="text-slate-500 text-lg">
                  Based on your resume, we found opportunities tailored to your skills.
                </p>
              </div>
            </div>

            {/* RIGHT: Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              
              {/* Search Field */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by role or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
                >
                  <option value="best">Sort: Best Match</option>
                  <option value="recent">Sort: Most Recent</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-red-100 rounded-2xl shadow-sm">
            <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Oops! Something went wrong</h3>
            <p className="text-slate-500 mt-1 max-w-sm">{error}</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job: any, index: number) => (
              <JobCard
                key={job.id || index}
                job={job}
                matchScore={job.matchScore || matchScore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No matching jobs found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Try adjusting your search terms or update your resume for better results.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * 🔥 Sub-component for Stats
 */
const StatCard = ({ label, value, color = "text-slate-900" }: { label: string; value: any; color?: string }) => (
  <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 min-w-[140px] shadow-sm hover:shadow-md transition-shadow">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);