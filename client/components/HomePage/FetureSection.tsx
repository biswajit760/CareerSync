"use client";

import { Brain, BarChart, Briefcase } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "ATS Score Analysis",
      description: "Get a detailed ATS score based on keywords, experience, and formatting.",
      icon: BarChart,
      // Custom styling for this specific card
      theme: "hover:bg-emerald-50 hover:border-emerald-200",      iconColor: "text-emerald-600",
    },
    {
      title: "AI Skill Gap Detection",
      description: "Discover missing skills and improve your resume with AI-powered insights.",
      icon: Brain,
      theme: "hover:bg-blue-50 hover:border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Smart Job Matching",
      description: "Get personalized job recommendations based on your skills and resume.",
      icon: Briefcase,
      theme: "hover:bg-purple-50 hover:border-purple-200",
      iconColor: "text-purple-600",
    }
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 🔥 Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Smart Features
          </div>

          <h2 className="text-4xl md:text-5xl font-medium text-gray-700 tracking-tight">
            Improve your resume with AI
          </h2>

          <p className="mt-6 text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
            CareerSync helps you analyze your resume, identify missing skills,
            and match with the best job opportunities using AI.
          </p>
        </div>

        {/* 🔥 Content Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* 🖼️ Left Side (Overlapping Images) */}
          <div className="relative flex justify-center h-[400px]">
            {/* Top/Back Image */}
            <div className="absolute top-0 left-10 md:left-20 z-0">
              <img
                src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=600&q=80"
                className="w-[300px] h-[400px] object-cover rounded-[2rem] shadow-2xl rotate-[-2deg]"
                alt="workspace"
              />
            </div>

            {/* Bottom/Front Image */}
            <div className="absolute bottom-0 right-10 md:right-20 z-10">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
                className="w-[260px] h-[360px] object-cover rounded-[2rem] shadow-2xl border-4 border-white rotate-[2deg]"
                alt="professional"
              />
            </div>
            
            {/* Subtle background glow to match image */}
            <div className="absolute inset-0 bg-purple-100/30 blur-[100px] rounded-full -z-10" />
          </div>

          {/* 📋 Right Side (Features List) */}
          <div className="flex flex-col gap-5 ">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`
                  group p-6 rounded-2xl border border-transparent transition-all duration-300 cursor-pointer
                  
                  ${feature.theme}
                `}
              >
                <div className="flex items-start gap-5">
                  <div className={`
                    p-3 rounded-lg bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                    ${feature.iconColor}
                  `}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-md text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}