// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CareerSync - AI-Powered ATS Resume Analyzer",
  description: "Optimize your resume and match with jobs using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col bg-gray-50"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <AuthProvider>
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />

            {/* 🔥 GLOBAL TOAST SYSTEM */}
            <Toaster
  position="top-center"
  gutter={10}
  containerStyle={{
    top: 20,
    right: 20,
  }}
  toastOptions={{
    duration: 3500,
    style: {
      background: "linear-gradient(135deg, #1f2937, #111827)",
      color: "#fff",
      borderRadius: "12px",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    },

    success: {
      style: {
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#16a34a",
      },
    },

    error: {
      style: {
        background: "linear-gradient(135deg, #dc2626, #ef4444)",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#dc2626",
      },
    },
  }}
/>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}