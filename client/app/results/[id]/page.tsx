"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const AtsRadarChart = dynamic(
  () => import("@/components/analyze/AtsRadarChart"),
  { ssr: false }
);

import RecruiterImpression from "@/components/report/RecruiterImpression";
import CriticalGaps from "@/components/report/CriticalGaps";
import KeywordAnalysis from "@/components/report/KeywordAnalysis";
import AnalysisHeader from "@/components/report/AnalysisHeader";

export default function ATSReportPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchATSReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportId = params?.id;
        if (!reportId) {
          setError("Report ID not found");
          setLoading(false);
          return;
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${API_URL}/api/ats/${reportId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.message || `Failed to fetch ATS report (${response.status})`
          );
        }

        const result = await response.json();
        setData(result?.data || result);
      } catch (err: any) {
        console.error("Error fetching ATS report:", err);
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchATSReport();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-white/60">Loading ATS Report...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-300 mx-auto" />
          <p className="mt-4 text-white/60">{error || "Failed to load report"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* ================================================= */}
      {/* CINEMATIC BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_35%)]" />

      <div className="absolute top-[-10%] left-[-10%] w-44 sm:w-80 md:w-[420px] lg:w-[700px] h-44 sm:h-80 md:h-[420px] lg:h-[700px] bg-lime-400/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-20%] right-[-10%] w-44 sm:w-80 md:w-[420px] lg:w-[700px] h-44 sm:h-80 md:h-[420px] lg:h-[700px] bg-lime-400/5 blur-[180px] rounded-full pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >

          <div className="inline-flex items-center gap-3 rounded-full border border-lime-400/15 bg-lime-400/[0.05] px-5 py-2 backdrop-blur-xl">

            <Sparkles className="w-4 h-4 text-lime-300" />

            <span className="text-[11px] uppercase tracking-[0.24em] text-lime-300">
              AI Resume Intelligence
            </span>
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-semibold tracking-[-0.06em] leading-[0.92]">

            Career Intelligence

            <br />

            <span className="bg-gradient-to-r from-white via-lime-100 to-lime-400 bg-clip-text text-transparent">
              ATS Report
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/45">
            AI-powered ATS analysis evaluating recruiter compatibility,
            technical alignment, keyword optimization,
            and hiring readiness.
          </p>
        </motion.div>

        {/* ================================================= */}
        {/* TOP METRICS */}
        {/* ================================================= */}

        <AnalysisHeader data={data} />

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* LEFT SIDE */}

          <div className="space-y-8 xl:col-span-8">

            {/* EXECUTIVE SUMMARY */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl overflow-hidden">

              <div className="flex items-center gap-4 border-b border-white/[0.05] px-8 py-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/10 bg-lime-400/[0.08]">
                  <BrainCircuit className="w-6 h-6 text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-medium">
                    Executive Summary
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    AI-generated recruiter overview
                  </p>
                </div>
              </div>

              <div className="p-8">

                <div className="rounded-[28px] border border-white/[0.06] bg-black/20 p-8">

                  <p className="text-[15px] leading-8 text-white/65">
                    {data?.executiveSummary ||
                      "This candidate demonstrates strong full-stack engineering capability with solid ATS compatibility, relevant technical projects, and practical MERN stack expertise. The resume aligns well with recruiter expectations, though keyword optimization and technical depth can be further improved for higher shortlist probability."}
                  </p>
                </div>
              </div>
            </div>

            {/* STRUCTURAL HEALTH */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl overflow-hidden">

              <div className="flex items-center gap-4 border-b border-white/[0.05] px-8 py-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/10 bg-lime-400/[0.08]">
                  <ShieldCheck className="w-6 h-6 text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-medium">
                    Structural Health Check
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    ATS formatting & optimization audit
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">

                {[
                  {
                    section: "Contact Information",
                    status: "Optimal",
                    analysis: "All links verified",
                    type: "good",
                  },
                  {
                    section: "Professional Experience",
                    status: "Strong",
                    analysis: "Quantifiable metrics found",
                    type: "good",
                  },
                  {
                    section: "Technical Skills",
                    status: "Needs Work",
                    analysis: "Missing key skill tags",
                    type: "warning",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="
                      flex items-center justify-between
                      rounded-2xl
                      border border-white/[0.05]
                      bg-black/20
                      px-6 py-5
                    "
                  >

                    <div>
                      <h4 className="text-white font-medium">
                        {row.section}
                      </h4>

                      <p className="mt-1 text-sm text-white/35">
                        {row.analysis}
                      </p>
                    </div>

                    <div
                      className={`
                        flex items-center gap-2
                        rounded-full px-4 py-2 text-sm

                        ${
                          row.type === "good"
                            ? "bg-lime-400/[0.08] text-lime-300 border border-lime-400/15"
                            : "bg-orange-400/[0.08] text-orange-300 border border-orange-400/15"
                        }
                      `}
                    >

                      {row.type === "good" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}

                      {row.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECRUITER IMPRESSION */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl overflow-hidden">

              <div className="flex items-center gap-4 border-b border-white/[0.05] px-8 py-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/10 bg-lime-400/[0.08]">
                  <BrainCircuit className="w-6 h-6 text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-medium text-white">
                    Recruiter Impression
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    AI-generated hiring perspective
                  </p>
                </div>
              </div>

              <div className="p-8">
                <RecruiterImpression
                  strengths={data?.strengths || []}
                  improvements={data?.improvements || []}
                />
              </div>
            </div>

            {/* CRITICAL GAPS */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl overflow-hidden">

              <div className="flex items-center gap-4 border-b border-white/[0.05] px-8 py-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-400/[0.08]">
                  <AlertTriangle className="w-6 h-6 text-orange-300" />
                </div>

                <div>
                  <h3 className="text-xl font-medium text-white">
                    Critical Gaps
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    Missing ATS optimization opportunities
                  </p>
                </div>
              </div>

              <div className="p-8">
                <CriticalGaps
                  improvements={data?.improvements || []}
                  score={data?.atsScore}
                />
              </div>
            </div>

            {/* KEYWORD ANALYSIS */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl overflow-hidden">

              <div className="flex items-center gap-4 border-b border-white/[0.05] px-8 py-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.08]">
                  <Sparkles className="w-6 h-6 text-cyan-300" />
                </div>

                <div>
                  <h3 className="text-xl font-medium text-white">
                    Keyword Intelligence
                  </h3>

                  <p className="mt-1 text-sm text-white/35">
                    ATS keyword alignment breakdown
                  </p>
                </div>
              </div>

              <div className="p-8">
                <KeywordAnalysis data={data} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-8 xl:col-span-4">

            {/* RADAR */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-8">

              <div className="flex items-center gap-3">

                <ScanSearch className="w-5 h-5 text-lime-300" />

                <p className="text-sm font-medium">
                  ATS Dimension Audit
                </p>
              </div>

              <div className="mt-10">
                <AtsRadarChart
                  breakdown={data?.scoreBreakdown}
                />
              </div>

              
            </div>

            {/* MISSING KEYWORDS */}

            <div className="rounded-[36px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-8">

              <div className="flex items-center gap-3">

                <Sparkles className="w-5 h-5 text-lime-300" />

                <p className="text-sm font-medium">
                  Missing Keywords
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">

                {(data?.missingSkills || [])
                  .slice(0, 10)
                  .map((skill: string, i: number) => (
                    <div
                      key={i}
                      className="
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-black/20
                        px-4
                        py-2
                        text-sm
                        text-white/70
                      "
                    >
                      {skill}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}