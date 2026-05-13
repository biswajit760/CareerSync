"use client";
 import { Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, LayoutGrid, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    // SaaS Upgrade: Glassmorphism and subtle bottom border
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/70 backdrop-blur-md border-b border-slate-300/60">
      <div className="w-full max-w-7xl px-4 h-16 flex items-center justify-between">
        
<Link href="/" className="flex items-center gap-3 group">
  {/* Icon Mark — Revamped */}
<div className="relative h-[43px] w-[43px] flex-shrink-0 ">
  <div
    className="h-full w-full rounded-[13px] flex items-center justify-center transition-all duration-200 group-hover:scale-[1.06] p-2"
    style={{
      background: "linear-gradient(145deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(34,197,94,0.35), inset 0 1px 0 rgba(255,255,255,0.22)",
    }}
  >
    <img
      src="/Logo.svg"
      alt="CareerSync"
      className="w-6 h-6 object-contain brightness-0 invert group-hover:scale-[1.08] transition-transform duration-200"
    />
  </div>
</div>

  {/* Wordmark (Kept exactly as requested) */}
  <div className="flex flex-col leading-none gap-1">
    <div className="flex items-baseline gap-0">
      <span
        className="text-[26px] font-bold tracking-[-0.04em] text-slate-900 leading-none"
        style={{ fontFeatureSettings: '"kern" 1' }}
      >
        Career
      </span>
      <span
        className="text-[26px] font-bold tracking-[-0.04em] text-emerald-600 leading-none"
        style={{ fontFeatureSettings: '"kern" 1' }}
      >
        Sync
      </span>
    </div>

    <div className="flex items-center gap-2">
      <div className="h-px w-full bg-emerald-500/25 group-hover:bg-emerald-500/50 transition-colors duration-300" />
    </div>

    <span className="text-[9px] uppercase tracking-[0.14em] font-medium text-slate-400 leading-none">
      Career Intelligence Platform
    </span>
  </div>
</Link>

        {/* CENTER - Capsule Nav (Optimized Spacing) */}
        <nav className="hidden md:flex items-center gap-2 px-2 py-1.5 border border-slate-200/50 rounded-md bg-slate-100/40">
          {[
            { label: "Analyze Resume", href: "/analyze" },
            { label: "Job Match", href: "/job-match" },
            { label: "My Report", href: "/my-report" },
            ...(isAuthenticated ? [{ label: "Dashboard", href: "/dashboard" }] : []),
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-[15px] font-medium transition-all rounded-md ${
                isActive(item.href)
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT - Auth */}
        <div className="flex items-center gap-4">
  {isAuthenticated && user ? (
    <div className="relative" ref={dropdownRef}>
      
      {/* Avatar ONLY */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative rounded-full focus:outline-none"
      >
        <img
          src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover border border-slate-400/50 hover:scale-105 transition-transform cursor-pointer"
        />      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 overflow-hidden animate-in fade-in zoom-in duration-200">
          
          {/* User Info */}
          <div className="px-3 py-2 border-b border-slate-50">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          {/* Menu */}
          <div className="p-1">
            <Link href="/dashboard" className="block px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition">
              Dashboard
            </Link>

            <Link href="/settings" className="block px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition">
              Account Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition"
      >
        Log in
      </Link>

      <Link
        href="/register"
        className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-sm active:scale-95"
      >
        Get started
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )}
</div>
      </div>
    </header>
  );
}