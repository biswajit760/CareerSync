'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, tokenManager } from '@/lib/api';
import StatsCards from '@/components/dashboard/StatsCards';
import ComparisonChart from '@/components/dashboard/ComparisonChart';
import RecentScansTable from '@/components/dashboard/RecentScansTable';
import {
  Upload,
  Search,
} from 'lucide-react';
import HeroBanner from '@/components/dashboard/HeroBanner';

interface RecentScan {
  _id: string;
  atsScore: number;
  jobTitle: string;
  companyName: string;
  fileName: string;
  createdAt: string;
  summary: string;
}

interface ScoreBreakdown {
  keywordMatch: number;
  skillsMatch: number;
  experience: number;
  projects: number;
  formatting: number;
}

interface DashboardData {
  stats: {
    totalScans: number;
    averageScore: number;
    bestScore: number;
    latestScore: number;
    improvement: number;
    successRate: number;
  };
  recentScans: RecentScan[];
  comparisonData: {
    labels: string[];
    overallScores: number[];
    breakdowns: ScoreBreakdown[];
    jobTitles: string[];
    dates: string[];
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      try {
        setDataLoading(true);
        const token = tokenManager.get();
        if (!token) throw new Error('No authentication token found');

        const [statsRes, scansRes, comparisonRes] = await Promise.all([
          dashboardAPI.getStats(token),
          dashboardAPI.getRecentScans(token),
          dashboardAPI.getComparisonData(token),
        ]);

        setDashboardData({
          stats: statsRes.data,
          recentScans: scansRes.data,
          comparisonData: comparisonRes.data,
        });
        setError(null);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="relative mx-auto w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500 absolute inset-0" />
            <div className="animate-ping rounded-full h-3 w-3 bg-emerald-400 absolute top-0 right-0" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      
        {/* ─── Hero Banner ─── */}
        <HeroBanner
          userName={user.name}
          plan={user.plan}
          scanCount={user.scanCount}
          scanLimit={user.scanLimit}
          latestScore={dashboardData?.stats.latestScore ?? 0}
          improvement={dashboardData?.stats.improvement ?? 0}
          totalScans={dashboardData?.stats.totalScans ?? 0}
        />

        {/* ─── Data Section ─── */}
        {dataLoading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center gap-4">
            <div className="relative w-10 h-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-emerald-500" />
            </div>
            <p className="text-slate-500 text-sm">Crunching your data…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center space-y-3">
            <p className="text-red-600 font-medium text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : dashboardData ? (
          <>
            {/* Stats Cards */}
            <StatsCards stats={{ ...dashboardData.stats, scanLimit: user.scanLimit }} />

            {/* Chart */}
            {dashboardData.stats.totalScans > 0 && (
              <ComparisonChart data={dashboardData.comparisonData} />
            )}

            {/* Recent Scans — full width */}
            <RecentScansTable scans={dashboardData.recentScans} />

            {/* Quick Actions — full width below */}
             {/* Quick Actions */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <button

            onClick={() => router.push('/analyze')}

            className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-300 transition-all text-left"

          >

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">

                <Upload className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />

              </div>

              <div className="flex-1">

                <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Resume</h3>

                <p className="text-sm text-slate-600">

                  Analyze your resume with AI-powered insights and get personalized recommendations.

                </p>

              </div>

            </div>

          </button>



          <button

            onClick={() => router.push('/job-match')}

            className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-blue-300 transition-all text-left"

          >

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">

                <Search className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />

              </div>

              <div className="flex-1">

                <h3 className="text-lg font-semibold text-slate-900 mb-2">Find Jobs</h3>

                <p className="text-sm text-slate-600">

                  Discover career opportunities that match your skills and experience.

                </p>

              </div>

            </div>

          </button>

        </div>
          </>
        ) : null}
      </main>
    </div>
  );
}