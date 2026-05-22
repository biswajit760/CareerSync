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
      // Decode JWT token from Google
      const token = credentialResponse.credential;
      if (!token) {
        setError('Failed to get Google credentials');
        return;
      }

      // Decode the JWT to get user info
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
        payload.sub, // Google ID
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] via-[#F3F4F6] to-[#E5E7EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5E7EB]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#080D0B] mb-2">
              Welcome back
            </h2>
            <p className="text-[#4B5563]">
              Sign in to continue to CareerSync
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F2937] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-[#9CA3AF] text-[#080D0B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all duration-200 bg-[#F9FAFB]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1F2937] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-[#9CA3AF] text-[#080D0B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all duration-200 bg-[#F9FAFB]"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#10B981] focus:ring-[#10B981] border-[#E5E7EB] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[#4B5563]">
                  Remember me
                </label>
              </div>

              <a href="#" className="font-medium text-[#059669] hover:text-[#047857] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#9CA3AF] font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-[#4B5563]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#059669] hover:text-[#047857] transition-colors">
              Create one now
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
