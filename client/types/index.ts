// TypeScript interfaces for CareerSync

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  scanCount: number;
  scanLimit: number;
  profilePicture: string;
  authProvider: 'local' | 'google';
  savedJobs?: SavedJob[];
  createdAt?: string;
}

export interface SavedJob {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  savedAt: Date;
  notes?: string;
  applicationStatus: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// ============= DASHBOARD TYPES =============

export interface DashboardStats {
  atsScore: number;
  savedLeads: number;
  aiScans: number;
  marketFit: number;
  scansThisMonth: number;
  weeklyGrowth: number;
}

export interface TrajectoryPoint {
  name: string;
  score: number;
}

export interface SkillRadarData {
  skill: string;
  user: number;
  market: number;
}

export interface BenchmarkData {
  category: string;
  score: number;
  avg: number;
}

export interface WeeklyApplicationsData {
  day: string;
  value: number;
}

export interface DashboardSavedJob {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  date: string;
  logo: string;
  status: string;
}

export interface AtsBreakdownData {
  name: string;
  value: number;
}

export interface DashboardInsight {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
  action: string;
}

export interface DashboardData {
  stats: DashboardStats;
  userInfo: {
    name: string;
    email: string;
    profilePicture: string;
    plan: string;
    joinedAt: string;
  };
  performanceTrajectory: TrajectoryPoint[];
  skillRadarData: SkillRadarData[];
  atsBenchmark: BenchmarkData[];
  weeklyApplications: WeeklyApplicationsData[];
  savedJobsList: DashboardSavedJob[];
  atsBreakdown: AtsBreakdownData[];
  insights: DashboardInsight[];
  lastUpdated: string;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
  };
}
