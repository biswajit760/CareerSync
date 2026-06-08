"use client";

import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-zinc-400 mt-20 border-t border-white/10 overflow-hidden">
      {/* Subtle ambient glow matching the main UI theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#a3e635]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-12 z-10">
        {/* 🔥 Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand - takes up more space for balance */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Career<span className="text-[#a3e635]">Sync</span>
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
              Helping you improve your resume, identify skill gaps, and land better job opportunities with AI.
            </p>
            <div className="space-y-1 pt-2">
              <p className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer w-fit">
                +91 987654321
              </p>
              <p className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer w-fit">
                support@careersync.com
              </p>
            </div>
          </div>

          {/* Links Container */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Menu */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">Menu</h3>
              <ul className="space-y-3 text-sm">
                {["Home", "Features", "Dashboard", "Pricing"].map((item) => (
                  <li
                    key={item}
                    className="text-zinc-500 hover:text-white cursor-pointer transition-colors duration-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* More */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">More</h3>
              <ul className="space-y-3 text-sm">
                {["Docs", "Blog", "FAQs"].map((item) => (
                  <li
                    key={item}
                    className="text-zinc-500 hover:text-white cursor-pointer transition-colors duration-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">Categories</h3>
              <ul className="space-y-3 text-sm">
                {["Resumes", "ATS Reports", "Skill Analysis", "Jobs"].map((item) => (
                  <li
                    key={item}
                    className="text-zinc-500 hover:text-white cursor-pointer transition-colors duration-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">
                Social Media
              </h3>
              <div className="flex gap-3">
                {[FaFacebook, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#a3e635] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} CareerSync. All Rights Reserved.</p>

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors duration-200">
              Terms of Use
            </span>
            <span className="hover:text-white cursor-pointer transition-colors duration-200">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}