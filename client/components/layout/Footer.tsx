"use client";

import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#1c1f26] via-[#15181e] to-[#1c1f26] text-gray-400 mt-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">

        {/* 🔥 Top Grid */}
        <div className="grid md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              Career<span className="text-green-500">Sync</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Helping you improve your resume, identify skill gaps, and land better job opportunities with AI.
            </p>
            <p className="text-sm text-gray-500">+91 987654321</p>
            <p className="text-sm text-gray-500">support@careersync.com</p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Features", "Dashboard", "Pricing"].map((item) => (
                <li
                  key={item}
                  className="hover:text-green-500 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">More</h3>
            <ul className="space-y-2 text-sm">
              {["Docs", "Blog", "FAQs"].map((item) => (
                <li
                  key={item}
                  className="hover:text-green-500 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Resumes", "ATS Reports", "Skill Analysis", "Jobs"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-green-500 cursor-pointer transition"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Social Media
            </h3>
            <div className="flex gap-4">
              {[FaFacebook, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <div
                  key={i}
                  className="p-2 rounded-full bg-[#22252d] hover:bg-green-600 transition cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CareerSync. All Rights Reserved.</p>

          <div className="flex gap-6">
            <span className="hover:text-green-500 cursor-pointer transition">
              Terms of Use
            </span>
            <span className="hover:text-green-500 cursor-pointer transition">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}