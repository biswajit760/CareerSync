'use client';

import { Sparkles, FileText, TrendingUp } from 'lucide-react';

interface HeroBannerProps {
  userName: string;
  plan: string;
  scanCount: number;
  scanLimit: number;
  latestScore: number;
  improvement: number;
  totalScans: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" style={{ display: 'block' }}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="9"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
    </svg>
  );
}

export default function HeroBanner({
  userName, plan, scanCount, scanLimit,
  latestScore, improvement, totalScans,
}: HeroBannerProps) {
  const firstName = userName.split(' ')[0];

  return (
    <div
      className="relative rounded-[24px] px-12 py-11 flex items-center justify-between gap-8 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-shadow duration-300"
      style={{ background: 'linear-gradient(135deg,#0b1e2d 0%,#0d2b26 55%,#082820 100%)' }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute rounded-full" style={{ width: 340, height: 340, top: -100, right: 220, background: 'radial-gradient(circle,#10b981 0%,transparent 70%)', opacity: .09, filter: 'blur(1px)' }} />
      <div className="pointer-events-none absolute rounded-full" style={{ width: 260, height: 260, bottom: -80, right: 60, background: 'radial-gradient(circle,#0d9488 0%,transparent 70%)', opacity: .08, filter: 'blur(1px)' }} />
      <div className="pointer-events-none absolute rounded-full" style={{ width: 180, height: 180, top: 20, left: '50%', background: 'radial-gradient(circle,#10b981 0%,transparent 70%)', opacity: .06 }} />

      {/* Left content */}
      <div className="relative z-10 flex-1 min-w-0">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border"
          style={{ background: 'rgba(52,211,153,.1)', borderColor: 'rgba(52,211,153,.2)' }}>
          <Sparkles className="w-3 h-3" style={{ fill: '#34d399', color: '#34d399' }} />
          <span className="text-[11px] font-bold tracking-widest" style={{ color: '#34d399' }}>
            AI RESUME INTELLIGENCE
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[36px] font-black text-white leading-[1.15] tracking-tight mb-2.5">
          {getGreeting()}, {firstName} 👋
        </h1>

        {/* Subtext */}
        <p className="text-[14px] leading-relaxed mb-7 max-w-[400px]" style={{ color: '#7fa8a0' }}>
          Your resume analytics hub. Track scores, spot trends, and get smarter with every scan.
        </p>

        {/* Pills */}
        <div className="flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold px-4 py-2 rounded-xl border"
            style={{ color: '#cbd5e1', background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)' }}>
            <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: '#10b981' }} />
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </span>

          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold px-4 py-2 rounded-xl border"
            style={{ color: '#cbd5e1', background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)' }}>
            <FileText className="w-3.5 h-3.5 opacity-60" />
            {scanCount} / {plan === 'free' ? scanLimit : '∞'} scans used
          </span>

          {totalScans > 1 && (
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold px-4 py-2 rounded-xl border"
              style={{ color: '#cbd5e1', background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.1)' }}>
              <TrendingUp className="w-3.5 h-3.5 opacity-60" style={{ color: improvement > 0 ? '#10b981' : undefined }} />
              {improvement > 0 ? `+${improvement}` : improvement} pts improvement
            </span>
          )}
        </div>
      </div>

      {/* Score ring box */}
      {totalScans > 0 && (
        <div
          className="relative z-10 shrink-0 flex flex-col items-center rounded-[20px] px-9 py-7"
          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', minWidth: 196 }}
        >
          <p className="text-[11px] font-bold tracking-widest mb-4" style={{ color: '#64748b' }}>
            LATEST ATS SCORE
          </p>

          <div className="relative" style={{ width: 110, height: 110 }}>
            <ScoreRing score={latestScore} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[32px] font-black leading-none" style={{ color: '#10b981' }}>
                {latestScore}
              </span>
              <span className="text-[11px] font-semibold mt-0.5" style={{ color: '#475569' }}>
                / 100
              </span>
            </div>
          </div>

          <p className="text-[11px] font-semibold tracking-[.04em] mt-3" style={{ color: '#475569' }}>
            ATS Score
          </p>

          {totalScans > 1 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.25)', color: '#34d399' }}
            >
              ↑ +{improvement} pts
            </span>
          )}
        </div>
      )}
    </div>
  );
}