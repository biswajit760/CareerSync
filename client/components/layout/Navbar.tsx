"use client";

import { Sparkles, Briefcase, ArrowRight, LayoutGrid, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

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
    // Pure Glassmorphism Header Wrap
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-transparent antialiased py-4 ">
      <div className="w-full max-w-7xl px-4 flex items-center justify-between">
        
        {/* LEFT - Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Icon Mark */}
          <div className="relative h-[43px] w-[43px] flex-shrink-0">
            <div
              className="h-full w-full rounded-[13px] flex items-center justify-center transition-all duration-300 group-hover:scale-[1.04] p-2"
              style={{
                background: "linear-gradient(145deg, #a3e635 0%, #65a30d 50%, #3f6212 100%)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 4px 14px rgba(163,230,53,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <img
                src="/Logo.svg"
                alt="CareerSync"
                className="w-6 h-6 object-contain brightness-0 invert group-hover:scale-[1.05] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none gap-1">
            <div className="flex items-baseline gap-0">
              <span
                className="text-[26px] font-bold tracking-[-0.04em] text-white leading-none transition-colors duration-300 group-hover:text-gray-100"
                style={{ fontFeatureSettings: '"kern" 1' }}
              >
                Career
              </span>
              <span
                className="text-[26px] font-bold tracking-[-0.04em] text-[#a3e635] leading-none transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.3)]"
                style={{ fontFeatureSettings: '"kern" 1' }}
              >
                Sync
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px w-full bg-[#a3e635]/20 group-hover:bg-[#a3e635]/40 transition-colors duration-300" />
            </div>

            <span className="text-[9px] uppercase tracking-[0.14em] font-medium text-gray-400/80 leading-none">
              Career Intelligence Platform
            </span>
          </div>
        </Link>

        {/* CENTER - Complete Nav Wrapped in Premium Glassmorphism Container */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-2 border border-white/[0.08] rounded-full bg-white/[0.03] backdrop-blur-xl ">
          {[
            { label: "Home", href: "/" },
            { label: "Analyze Resume", href: "/analyze" },
            { label: "Job Match", href: "/job-match" },
            { label: "My Report", href: "/my-report" },
            ...(isAuthenticated ? [{ label: "Dashboard", href: "/dashboard" }] : []),
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 text-[14px] font-medium transition-colors duration-300 group ${
                isActive(item.href) ? "text-white" : "text-gray-100 hover:text-white"
              }`}
            >
              {/* Text label */}
              <span>{item.label}</span>
              
              {/* Clean Smooth Underline Effect */}
              <span 
                className={`absolute bottom-[-1px] left-4 right-4 h-[3px] rounded-full bg-[#a3e635] transition-all duration-300 origin-left ${
                  isActive(item.href) ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-[calc(100%-2rem)]"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* RIGHT - Auth Configurations */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              
              {/* Avatar Only */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative rounded-full focus:outline-none block group"
              >
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=84cc16&color=fff`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20 group-hover:border-[#a3e635]/60 group-hover:scale-105 transition-all cursor-pointer"
                />
              </button>

              {/* Premium Dark Glass Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#040a04]/80 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/[0.08] py-1.5 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                  
                  {/* User Info Header */}
                  <div className="px-4 py-2.5 border-b border-white/[0.06]">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1">
                    <Link href="/dashboard" className="block px-3 py-2 hover:bg-white/[0.04] text-gray-300 hover:text-white rounded-lg text-sm transition">
                      Dashboard
                    </Link>

                    <Link href="/settings" className="block px-3 py-2 hover:bg-white/[0.04] text-gray-300 hover:text-white rounded-lg text-sm transition">
                      Account Settings
                    </Link>

                    <div className="h-px bg-white/[0.06] my-1 mx-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-black bg-[#a3e635] rounded-full hover:bg-[#b2f048] transition-all shadow-[0_4px_20px_rgba(163,230,53,0.15)] active:scale-95"
              >
                Get started
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}