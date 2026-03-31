"use client";

import Button from "../ui/Button";
import {
  ArrowRight,
  Play,
  Star,
  Upload,
  FileText,
  Brain,
  BarChart,
  Briefcase,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-white">
      
      {/* 🔥 Background Glow Effect */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-gradient-to-r from-green-400 to-emerald-400 opacity-20 blur-[90px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* ⭐ Social Proof (Avatars + Rating) */}
        <div className="flex items-center justify-center gap-3 mb-8">
          
          {/* Avatars */}
          <div className="flex -space-x-2">
            {[
              "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97",
              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
              "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925",
              "https://images.unsplash.com/photo-1619895862022-09114b41f16f",
            ].map((src, i) => (
              <img
                key={i}
                src={`${src}?w=200&auto=format&fit=crop`}
                className="w-10 h-10 rounded-full border-2 border-white"
                alt="user"
              />
            ))}
          </div>

          {/* Rating */}
          <div className="flex flex-col items-start">
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-green-500 fill-green-500"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Used by 10,000+ users
            </p>
          </div>
        </div>

        {/* 🧠 Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 max-w-4xl mx-auto">
          Accelerate your career with AI-driven <br />
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            resume insights and job matches.
          </span>
        </h1>

        {/* 📄 Subtext */}
        <p className="mt-8 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Optimize your resume, identify missing skills, and land better job
          opportunities with AI.
        </p>

        {/* 🚀 Call To Action */}
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Button className="shadow-md hover:shadow-lg hover:scale-105">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>

          <Button variant="outline">
            <Play className="w-4 h-4" />
            Try Demo
          </Button>
        </div>

        {/* 🤝 Trust Line */}
        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Trusted by 1,000+ students and developers
          </p>
        </div>

        {/* ⚙️ Product Flow Section */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700">
            
            {/* Step Item */}
            {[
              { icon: Upload, label: "Upload CV" },
              { icon: FileText, label: "Resume Parsing" },
              { icon: Brain, label: "AI Analysis" },
              { icon: BarChart, label: "ATS Score" },
              { icon: Briefcase, label: "Job Matching" },
            ].map((step, index, arr) => {
              const Icon = step.icon;

              return (
                <div key={index} className="flex items-center gap-6">
                  
                  {/* Step */}
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6 text-green-600 hover:scale-110 transition" />
                    <span className="text-sm">{step.label}</span>
                  </div>

                  {/* Arrow (except last item) */}
                  {index !== arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}