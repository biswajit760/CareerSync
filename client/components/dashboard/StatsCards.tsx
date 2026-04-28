'use client';

import { TrendingUp, Award, Target, Activity, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalScans: number;
    averageScore: number;
    bestScore: number;
    latestScore: number;
    improvement: number;
    successRate: number;
    scanLimit?: number;
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-500/20' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-500/20' };
  return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-500/20' };
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Work';
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  unit,
  subtitle,
  badge,
  progress,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  unit?: string;
  subtitle: string;
  badge: React.ReactNode;
  progress?: React.ReactNode;
}) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: iconBg }}
        >
          <div style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-4xl font-black text-slate-900 leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-xl font-bold text-slate-400 ml-1">
            {unit}
          </span>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 font-medium mb-4">
        {subtitle}
      </p>

      {/* Progress Bar */}
      {progress && (
        <div className="mb-4">
          {progress}
        </div>
      )}

      {/* Badge */}
      <div className="flex items-center gap-2">
        {badge}
      </div>
    </div>
  );
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const limit = stats.scanLimit ?? 5;
  const successfulScans = Math.round(((stats.successRate ?? 0) / 100) * stats.totalScans);
  
  const avgColors = getScoreColor(stats.averageScore);
  const bestColors = getScoreColor(stats.bestScore);
  const rateColors = getScoreColor(stats.successRate ?? 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      
      {/* Total Scans */}
      <StatCard
        icon={<Activity className="w-5 h-5" />}
        iconBg="#f1f5f9"
        iconColor="#64748b"
        label="Total Scans"
        value={stats.totalScans}
        subtitle="Resume analyses completed"
        progress={
          <ProgressBar 
            value={stats.totalScans} 
            max={limit} 
            color="#64748b" 
          />
        }
        badge={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-600">
              {stats.totalScans} / {limit}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Used
            </span>
          </div>
        }
      />

      {/* Average Score */}
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="#d1fae5"
        iconColor="#10b981"
        label="Average Score"
        value={stats.averageScore}
        subtitle="Overall performance"
        progress={
          <ProgressBar 
            value={stats.averageScore} 
            max={100} 
            color={avgColors.text.replace('text-', '#').replace('600', '500')} 
          />
        }
        badge={
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${avgColors.bg} ${avgColors.text} border ${avgColors.border}`}>
            {getScoreLabel(stats.averageScore)}
          </span>
        }
      />

      {/* Best Score */}
      <StatCard
        icon={<Award className="w-5 h-5" />}
        iconBg="#fef3c7"
        iconColor="#f59e0b"
        label="Best Score"
        value={stats.bestScore}
        subtitle="Highest achievement"
        progress={
          <ProgressBar 
            value={stats.bestScore} 
            max={100} 
            color="#f59e0b" 
          />
        }
        badge={
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${bestColors.bg} ${bestColors.text} border ${bestColors.border}`}>
            {getScoreLabel(stats.bestScore)}
          </span>
        }
      />

      {/* Latest Score */}
      <StatCard
        icon={<Target className="w-5 h-5" />}
        iconBg="#dbeafe"
        iconColor="#3b82f6"
        label="Latest Score"
        value={stats.latestScore}
        subtitle="Most recent scan"
        progress={
          <ProgressBar 
            value={stats.latestScore} 
            max={100} 
            color="#3b82f6" 
          />
        }
        badge={
          stats.totalScans > 1 ? (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              stats.improvement >= 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {stats.improvement >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {stats.improvement > 0 ? '+' : ''}{stats.improvement} pts
            </div>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              First scan
            </span>
          )
        }
      />

      {/* Success Rate */}
      <StatCard
        icon={<CheckCircle className="w-5 h-5" />}
        iconBg="#ede9fe"
        iconColor="#8b5cf6"
        label="Success Rate"
        value={stats.successRate ?? 0}
        unit="%"
        subtitle="Scans scored ≥ 80"
        progress={
          <ProgressBar 
            value={stats.successRate ?? 0} 
            max={100} 
            color="#8b5cf6" 
          />
        }
        badge={
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${rateColors.bg} ${rateColors.text} border ${rateColors.border}`}>
            {successfulScans} of {stats.totalScans} passed
          </span>
        }
      />

    </div>
  );
}