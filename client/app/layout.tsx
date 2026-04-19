// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CareerSync - AI-Powered ATS Resume Analyzer",
  description: "Optimize your resume and match with jobs using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
            {children}
            </main>
            <Footer />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}