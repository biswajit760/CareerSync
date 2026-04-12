"use client";

import ResumeForm from "@/components/analyze/ResumeForm";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return (
    
      <ResumeForm />
    
  );
}