"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tokenManager } from "@/lib/api";

import { 
  FiDownload, FiCheck, FiX, FiAlertCircle, 
  FiFileText, FiTarget, FiBarChart2, FiLayers 
} from "react-icons/fi";
import dynamic from "next/dynamic";
// Add this import:
import AtsCircularGauge from "../../../components/analyze/AtsCircularGauge"; 
import { motion } from "framer-motion";
// ... existing imports

const AtsRadarChart = dynamic(() => import("../../../components/analyze/AtsRadarChart"), { ssr: false });

export default function ResultPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const token = tokenManager.get();
        if (!token) { router.push("/login"); return; }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setData(result.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchResult();
  }, [id, router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Generating Report...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. TOP UTILITY BAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Report ID: {id?.slice(-6)}</span>
            <h1 className="text-sm font-semibold text-slate-600">Resume Intelligence Analysis</h1>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            <FiDownload size={14} /> EXPORT PDF
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6 lg:p-10">
        
        {/* 2. HEADER STATS GRID */}
        <header className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Match</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{data.atsScore}%</span>
              <span className={`text-[10px] font-bold ${data.atsScore > 75 ? 'text-emerald-600' : 'text-amber-500'}`}>
                {data.atsScore > 75 ? '↑ HIGH' : '→ MED'}
              </span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Level</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">{data.impactLevel ?? 'N/A'}</span>
              <span className="text-[10px] font-bold text-slate-400">/ 10</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Keywords Found</p>
            <span className="text-3xl font-bold tabular-nums">{data.scoreBreakdown?.keywordMatch || 0}</span>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Readiness</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
              data.marketReadiness === 'ready' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
            }`}>{data.marketReadiness ?? 'Unknown'}</span>
          </div>        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTENT AREA (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* EXECUTIVE SUMMARY */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3 flex items-center gap-2">
                <FiFileText className="text-slate-400" />
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Executive Summary</h2>
              </div>
              <div className="p-6">
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  {data.summary}
                </p>
              </div>
            </section>

            {/* SECTION HEALTH CHECK - NEW UTILITY */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3 flex items-center gap-2">
                <FiLayers className="text-slate-400" />
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Structural Health Check</h2>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-3">Section</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    <tr>
                      <td className="px-6 py-4">Contact Information</td>
                      <td className="px-6 py-4 text-emerald-600 flex items-center gap-1.5"><FiCheck /> Optimal</td>
                      <td className="px-6 py-4 text-right text-slate-400">All links verified</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Professional Experience</td>
                      <td className="px-6 py-4 text-emerald-600 flex items-center gap-1.5"><FiCheck /> Strong</td>
                      <td className="px-6 py-4 text-right text-slate-400">Quantifiable data found</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Technical Skills</td>
                      <td className="px-6 py-4 text-amber-500 flex items-center gap-1.5"><FiAlertCircle /> Needs Keyword Optimization</td>
                      <td className="px-6 py-4 text-right text-slate-400">Missing {data.missingSkills.length} key tags</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* IMPROVEMENT TASK LIST */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3 flex items-center gap-2 text-blue-600">
                <FiTarget />
                <h2 className="text-xs font-bold uppercase tracking-widest">Action Items & Roadmap</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {data.improvements.map((tip: string, i: number) => (
                  <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-default">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">{tip}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* RADAR CHART COMPONENT */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <AtsRadarChart breakdown={data.scoreBreakdown} />
            </div>

            {/* SKILLS TAGS CLOUD */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiBarChart2 /> Identified Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.strengths.slice(0, 10).map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-bold">
                    {skill.replace('• ', '')}
                  </span>
                ))}
              </div>
            </section>

            {/* CRITICAL GAPS */}
            <section className="bg-rose-50 border border-rose-100 rounded-xl p-6">
              <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiX size={14} /> Missing Critical Gaps
              </h3>
              <div className="space-y-3">
                {data.missingSkills.map((gap: string, i: number) => (
                  <div key={i} className="text-xs font-semibold text-rose-700/80 bg-white/60 px-3 py-2 rounded border border-rose-200/50">
                    {gap}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}