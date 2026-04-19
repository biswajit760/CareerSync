"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";

import { tokenManager } from "@/lib/api";

// Components
import AnalysisHeader from "@/components/report/AnalysisHeader";
import ExecutiveSummary from "@/components/report/ExecutiveSummary";
import StructuralHealth from "@/components/report/StructuralHealth";
import RecruiterImpression from "@/components/report/RecruiterImpression";
import KeywordAnalysis from "@/components/report/KeywordAnalysis";
import CriticalGaps from "@/components/report/CriticalGaps";

// Constants
import { G, sectionLabel, sectionTitle } from "@/lib/constants";

// Lazy load
const AtsRadarChart = dynamic(
  () => import("../../../components/analyze/AtsRadarChart"),
  { ssr: false }
);

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const token = tokenManager.get();

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ats/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch report");
        }

        const result = await res.json();
        setData(result.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, router]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className={sectionLabel}>
            Generating CareerSync Report…
          </span>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // No data
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Report not found.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-blue-100">
      
      
      {/* MAIN CONTENT */}
      <main className="mt-16 mx-auto max-w-7xl p-6 lg:p-10 space-y-8 mx-auto max-w-7xl p-6 lg:p-10 space-y-10">

        {/* SECTION: OVERVIEW */}
        <section className="space-y-6">
          

          <AnalysisHeader 
            atsScore={data.atsScore} 
            skillsMatch={data.scoreBreakdown?.skillsMatch || 0}
            keywordMatch={data.scoreBreakdown?.keywordMatch || 0}
          />
        </section>

        {/* SECTION: ANALYSIS GRID */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-8">
            <ExecutiveSummary content={data.summary} />

            <StructuralHealth 
              missingCount={data.missingSkills?.length || 0} 
            />
          </div>

          {/* RIGHT */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className={sectionLabel + " mb-4"}>
                ATS Dimension Audit
              </p>

              <AtsRadarChart breakdown={data.scoreBreakdown} />

              <div className="mt-6 flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Avg Score</p>
                  <p className="font-semibold">
                    {data.avgScore || 0}
                  </p>
                </div>

                <div className="text-green-600 font-semibold">
                  Top {data.percentile || 0}%
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* SECTION: DETAILS */}
        <section className="space-y-6">
         

          <RecruiterImpression 
            strengths={data.strengths || []} 
            improvements={data.improvements || []} 
          />

          <CriticalGaps 
            improvements={data.improvements || []} 
            score={data.atsScore} 
          />

          <KeywordAnalysis data={data} />
        </section>

      </main>
    </div>
  );
}