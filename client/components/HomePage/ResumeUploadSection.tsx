

"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

export default function ResumeUploadSection() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* 🔥 Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Check your resume ATS score instantly
        </h2>

        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Upload your resume and get AI-powered insights, skill gap analysis,
          and job recommendations in seconds.
        </p>

        {/* 📦 Upload Box */}
        <div className="mt-10 border-2 border-dashed border-green-200 rounded-2xl p-10 hover:border-green-400 transition relative">

          <div className="flex flex-col items-center gap-4">
            <UploadCloud className="w-10 h-10 text-green-600" />

            <p className="text-gray-600">
              Drag & drop your resume or click to upload
            </p>

            {/* File Input */}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload resume PDF"
            />
            {/* Selected File */}
            {fileName && (
              <p className="text-sm text-green-600 font-medium">
                Selected: {fileName}
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button className="shadow-md hover:shadow-lg hover:scale-105">
            Analyze Resume
          </Button>
        </div>

      </div>
    </section>
  );
}