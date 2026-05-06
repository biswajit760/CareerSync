"use client";

import Link from "next/link";
import { ArrowRight, Home, FileText, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 text-center">
      
      {/* 404 Heading */}
      <p className="text-sm font-medium text-green-600 mb-2">
        OOPS! PAGE NOT FOUND
      </p>

      <h1 className="text-7xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
        404
      </h1>

      {/* Description */}
      <h2 className="mt-4 text-xl font-semibold text-slate-800">
        Looks like you’ve taken a wrong turn.
      </h2>

      <p className="mt-2 text-slate-500 max-w-md">
        The page you're looking for doesn’t exist or has been moved. 
        Let’s get you back on track.
      </p>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white font-medium shadow-sm transition hover:bg-green-700"
      >
        Go to Dashboard <ArrowRight size={18} />
      </Link>

      {/* Quick Navigation Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        
        <Link
          href="/analyze"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" />
            <div>
              <p className="font-semibold text-slate-800">Analyze Resume</p>
              <p className="text-sm text-slate-500">
                Upload and analyze your resume
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/job-match"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition text-left"
        >
          <div className="flex items-center gap-3">
            <Briefcase className="text-green-600" />
            <div>
              <p className="font-semibold text-slate-800">Job Match</p>
              <p className="text-sm text-slate-500">
                Find jobs that match your profile
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition text-left"
        >
          <div className="flex items-center gap-3">
            <Home className="text-green-600" />
            <div>
              <p className="font-semibold text-slate-800">Dashboard</p>
              <p className="text-sm text-slate-500">
                Go back to your dashboard
              </p>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}