import { useState, useEffect, useCallback } from 'react';
import { DashboardData, DashboardApiResponse, DashboardStats, DashboardStatsResponse } from '@/types';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
interface UseDashboardDataReturn {
  data: DashboardData | null;
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage dashboard data
 * Provides real data from backend with error handling and refresh capabilities
 */
export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return (
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken')
  );
};

console.log("API URL =", API_BASE_URL);
console.log("Dashboard URL =", `${API_BASE_URL}/api/dashboard/data`);

  /**
   * Fetch complete dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/dashboard/data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const result: DashboardApiResponse = await response.json();

      if (result.success) {
        setData(result.data);
        setStats(result.data.stats);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch only stats (lightweight endpoint for frequent updates)
   */
  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const result: DashboardStatsResponse = await response.json();

      if (result.success) {
        setStats(result.data.stats);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  }, []);

  /**
   * Fetch data on mount
   */
  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh of stats every 30 seconds
    const statsInterval = setInterval(() => {
      fetchDashboardStats();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(statsInterval);
    };
  }, [fetchDashboardData, fetchDashboardStats]);

  return {
    data,
    stats,
    loading,
    error,
    refreshData: fetchDashboardData,
    refreshStats: fetchDashboardStats,
  };
};

export default useDashboardData;
