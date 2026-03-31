"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Career<span className="text-green-600">Sync</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <Link href="/#features" className="hover:text-black transition">
            Features
          </Link>
          <Link href="/#how" className="hover:text-black transition">
            How it works
          </Link>
          <Link href="/#contact" className="hover:text-black transition">
            Contact
          </Link>        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-full hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}