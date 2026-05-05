import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ================= TOKEN MANAGER =================
export const tokenManager = {
  set: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  get: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  remove: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },
};

// ================= CORE API FUNCTION =================
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = tokenManager.get();

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid server response");
    }

    // 🔥 Centralized error handling
    if (!response.ok) {
      const message = data?.message || "Something went wrong";

      // Prevent duplicate toasts (important)
      toast.dismiss();
      toast.error(message);

      const error: any = new Error(message);
      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("🔥 API ERROR:", error.message);

    const message = error.message || "Network error";

    // Avoid double toast (only show if not already shown)
    if (!error.status) {
      toast.dismiss();
      toast.error(message);
    }

    throw new Error(message);
  }
}

// ================= AUTH API =================
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  googleAuth: (
    googleId: string,
    email: string,
    name: string,
    profilePicture?: string
  ) =>
    apiCall("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ googleId, email, name, profilePicture }),
    }),

  getMe: () => apiCall("/api/auth/me"),
};

// ================= ATS =================
export const getUserReports = () => {
  return apiCall("/api/ats/user");
};

// ================= JOB MATCHING =================
export const jobMatchingAPI = {
  getPersonalizedJobs: (forceRefresh: boolean = false) =>
    apiCall(`/api/jobs/recommendations?forceRefresh=${forceRefresh}`),

  getUserProfile: () => apiCall("/api/jobs/profile"),

  updateProfilePreferences: (preferences: {
    preferredRoles?: string[];
    preferredIndustries?: string[];
    workModel?: string;
    companySize?: string;
  }) =>
    apiCall("/api/jobs/profile/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    }),
};

// ================= LEGACY JOB =================
export const getJobRecommendations = (resumeId: string) => {
  return apiCall(`/api/jobs/recommendations/${resumeId}`);
};