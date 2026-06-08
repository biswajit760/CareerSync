'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Redirect handled by context
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        setError('Failed to get Google credentials');
        return;
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      await googleLogin(
        payload.sub,
        payload.email,
        payload.name,
        payload.picture
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden mt-8">
      
      {/* LEFT COLUMN: Authentication Flow */}
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-28 z-10 relative bg-[#050505]">
        
        {/* Subtle mobile background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-sm mx-auto lg:w-[380px] relative">
          
         

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
              Log in to your account
            </h2>
            <p className="text-[14px] text-zinc-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-[13px] font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[13px] font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 bg-[#09090b] border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors text-[14px] shadow-sm"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[13px] font-medium text-zinc-300">
                    Password
                  </label>
                  <a href="#" className="text-[12px] font-medium text-zinc-400 hover:text-white transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 bg-[#09090b] border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors text-[14px] shadow-sm tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center py-1">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded bg-[#09090b] border-zinc-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[13px] text-zinc-400 cursor-pointer select-none hover:text-zinc-300 transition-colors">
                Remember for 30 days
              </label>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex justify-center items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 text-[14px] font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-medium">
              <span className="px-3 bg-[#050505] text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="flex justify-center [&>div]:w-full [&>div]:max-w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="380"
            />
          </div>

          <p className="mt-8 text-center text-[13px] text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-white hover:text-emerald-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Brand/Visual Showcase */}
      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden border-l border-zinc-800/50 bg-[#09090b]">
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Abstract Light Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Floating UI Elements / Mockups */}
        <div className="absolute inset-0 flex items-center justify-center p-12 perspective-1000">
          <div className="relative w-full max-w-[420px] aspect-square transform transition-transform duration-700 hover:scale-[1.02]">
            
            {/* Main glass card - Dashboard Widget Mockup */}
            <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col p-6 overflow-hidden transform rotate-[-2deg] transition-all duration-500 hover:rotate-0 hover:border-emerald-500/30">
              
              {/* Fake Window Controls */}
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono tracking-wider">app.careersync.io/report</div>
              </div>
              
              {/* Profile Match Section */}
              <div className="flex items-center gap-5 mb-8">
                {/* Score Circle */}
                <div className="relative w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" viewBox="0 0 36 36">
                    <path 
                      className="text-emerald-500" 
                      strokeDasharray="92, 100" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <span className="text-lg font-bold text-white relative z-10">92<span className="text-[10px] text-zinc-400">%</span></span>
                </div>
                
                <div>
                  <h3 className="text-white font-medium text-lg tracking-tight">Senior React Dev</h3>
                  <p className="text-emerald-400 text-sm flex items-center gap-1.5 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Excellent Match
                  </p>
                </div>
              </div>

              {/* Progress Bars / Stats */}
              <div className="space-y-5 flex-1">
                {/* Stat 1 */}
                <div>
                  <div className="flex justify-between text-[12px] mb-2">
                    <span className="text-zinc-400 font-medium">Keywords Identified</span>
                    <span className="text-white font-mono">24/28</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>

                {/* Stat 2 */}
                <div>
                  <div className="flex justify-between text-[12px] mb-2">
                    <span className="text-zinc-400 font-medium">Experience Match</span>
                    <span className="text-white font-mono">100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-400 w-full rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                  </div>
                </div>
                
                {/* Skill Badges */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold tracking-wide">React.js</span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold tracking-wide">TypeScript</span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold tracking-wide">GraphQL</span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-semibold tracking-wide">Node.js</span>
                </div>
              </div>
            </div>

            {/* Decorative overlapping card - Notification Toast */}
            <div className="absolute -bottom-8 -right-8 w-80 bg-[#111111] border border-zinc-800 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-4 flex gap-4 items-start z-10 transition-transform duration-500 hover:-translate-y-2 hover:border-emerald-500/50">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-0.5">
                <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white text-[14px] font-semibold mb-0.5">Resume Analyzed</p>
                <p className="text-zinc-400 text-[13px] leading-relaxed">Your profile has been updated and matched with 12 new premium jobs.</p>
                <p className="text-emerald-500 text-[10px] uppercase tracking-wider font-bold mt-2">Just now</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}