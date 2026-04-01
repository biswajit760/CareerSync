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
