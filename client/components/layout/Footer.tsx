"use client";

// import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-green-50 via-white to-green-50 border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* 🔥 Top Section */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo + Brand */}
          <div>
            <h2 className="text-xl font-bold">
              Career<span className="text-green-600">Sync</span>
            </h2>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="hover:text-green-600 cursor-pointer">Home</li>
              <li className="hover:text-green-600 cursor-pointer">Features</li>
              <li className="hover:text-green-600 cursor-pointer">Dashboard</li>
              <li className="hover:text-green-600 cursor-pointer">Pricing</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="hover:text-green-600 cursor-pointer">Docs</li>
              <li className="hover:text-green-600 cursor-pointer">Blog</li>
              <li className="hover:text-green-600 cursor-pointer">Community</li>
              <li className="hover:text-green-600 cursor-pointer">
                Careers{" "}
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Hiring
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="hover:text-green-600 cursor-pointer">Privacy</li>
              <li className="hover:text-green-600 cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>

        {/* 🔥 Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Tagline */}
          <p className="text-gray-600 text-sm text-center md:text-left max-w-md">
            Helping you improve your resume, identify skill gaps, and land better job opportunities with AI.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-gray-500">
            {/* <Github className="w-5 h-5 hover:text-green-600 cursor-pointer transition" />
            <Linkedin className="w-5 h-5 hover:text-green-600 cursor-pointer transition" />
            <Twitter className="w-5 h-5 hover:text-green-600 cursor-pointer transition" /> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CareerSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}