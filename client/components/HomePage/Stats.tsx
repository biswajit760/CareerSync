"use client";

export default function Stats() {
  return (
    
    <section className="w-full py-20 bg-white relative overflow-hidden border-y border-gray-200">
        
      
      {/* 🔥 Subtle Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-green-400 opacity-10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* 🔥 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          {/* Stat 1 */}
          <div className="hover:scale-105 transition">
            <h3 className="text-4xl md:text-5xl font-bold text-green-600">
              75%
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              of resumes rejected by ATS before human review
            </p>
          </div>

          {/* Stat 2 */}
          <div className="hover:scale-105 transition">
            <h3 className="text-4xl md:text-5xl font-bold text-green-600">
              2.4K+
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              resumes analyzed since launch
            </p>
          </div>

          {/* Stat 3 */}
          <div className="hover:scale-105 transition">
            <h3 className="text-4xl md:text-5xl font-bold text-green-600">
              16+
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              countries with live job listings
            </p>
          </div>

          {/* Stat 4 */}
          <div className="hover:scale-105 transition">
            <h3 className="text-4xl md:text-5xl font-bold text-green-600">
              100%
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              free — no subscription required
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}