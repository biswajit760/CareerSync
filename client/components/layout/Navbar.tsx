"use client";

import { ArrowRight, Menu, X, LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Analyze Resume", href: "/analyze" },
    { label: "Job Match", href: "/job-match" },
    { label: "My Report", href: "/my-report" },
    ...(isAuthenticated ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="fixed -top-2 left-0 right-0 z-50 px-4 py-5 md:py-6 pointer-events-none">
      <div className="max-w-[77rem] mx-auto relative pointer-events-auto">
        {/* Ambient Glow behind Navbar */}
        <div className="absolute inset-0 -z-10 bg-lime-500/5 blur-[50px] rounded-full" />

        <div className="h-16 px-3 sm:px-5 rounded-[5rem] border border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/50 ring-1 ring-white/[0.02] flex items-center justify-between transition-all duration-300">
          
          {/* LEFT - Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 px-2">
            {/* Elevated Ghost border icon */}
            <div className="w-9 h-9 rounded-[12px] border border-lime-400/30 bg-lime-400/5 flex items-center justify-center flex-shrink-0 group-hover:border-lime-400/80 group-hover:bg-lime-400/10 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(163,230,53,0.15)]">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#a3e635" strokeWidth="1.4" strokeDasharray="3.5 2" className="group-hover:animate-[spin_4s_linear_infinite]" />
                <circle cx="11" cy="11" r="3" fill="none" stroke="#a3e635" strokeWidth="1.4" />
                <path d="M11 4L11 8M11 14L11 18M4 11L8 11M14 11L18 11" stroke="#a3e635" strokeWidth="1.1" strokeLinecap="round" className="transition-transform group-hover:scale-110 duration-300 transform origin-center" />
                <circle cx="11" cy="11" r="1.3" fill="#a3e635" />
              </svg>
            </div>

            {/* Wordmark with gradient */}
            <span className="text-[20px] font-extrabold tracking-[-0.03em] leading-none">
              <span className="text-slate-100">Career</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300 drop-shadow-[0_0_8px_rgba(163,230,53,0.3)]">Sync</span>
            </span>
          </Link>

          {/* CENTER - Desktop Navigation */}
          <nav className="hidden lg:flex relative items-center gap-1 p-1 rounded-full">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2.5 text-[13px] tracking-wide font-medium transition-all duration-300 rounded-full group ${
                    active
                      ? "text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  
                  {/* Glowing Bottom Line for Active State */}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] rounded-t-full bg-lime-400 transition-all duration-500 ease-out ${
                      active
                        ? "w-4 shadow-[0_0_10px_#a3e635] opacity-100"
                        : "w-0 opacity-0 group-hover:w-2 group-hover:bg-white/30"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT - Auth & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth Links */}
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-[13px] font-medium text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-400 text-black text-[13px] font-semibold hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:-translate-y-[1px] transition-all duration-300"
                >
                  Get Started
                  <ArrowRight size={14} className="stroke-[2.5px]" />
                </Link>
              </div>
            )}

            {/* Profile Dropdown */}
            {isAuthenticated && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="block focus:outline-none p-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=84cc16&color=fff&bold=true`
                      }
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent hover:ring-lime-400/50 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-400 border-2 border-[#0a0a0a] rounded-full"></div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                      <p className="text-sm text-white font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-gray-400" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Settings size={16} className="text-gray-400" />
                        Account Settings
                      </Link>
                      <div className="my-1 border-t border-white/[0.06]" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[84px] left-0 right-0 rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300 origin-top">
            <div className="flex flex-col p-3 gap-1">
              {navLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                      active
                        ? "bg-lime-400/10 text-lime-400 border border-lime-400/10"
                        : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth Actions */}
              {!isAuthenticated && (
                <div className="mt-2 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full px-5 py-3.5 text-center rounded-2xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="w-full flex justify-center items-center gap-2 px-5 py-3.5 rounded-2xl bg-lime-400 text-black text-sm font-semibold hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)]"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}