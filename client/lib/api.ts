const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (name: string, email: string, password: string) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Login user
  login: async (email: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Google OAuth
  googleAuth: async (googleId: string, email: string, name: string, profilePicture?: string) => {
    return apiCall('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ googleId, email, name, profilePicture }),
    });
  },

  // Get current user profile
  getMe: async (token: string) => {
    return apiCall('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Token management
export const tokenManager = {
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  get: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

// Dashboard API calls
export const dashboardAPI = {
  // Get recent scans
  getRecentScans: async (token: string) => {
    return apiCall('/api/dashboard/recent-scans', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get comparison data for graph
  getComparisonData: async (token: string) => {
    return apiCall('/api/dashboard/comparison-data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get dashboard statistics
  getStats: async (token: string) => {
    return apiCall('/api/dashboard/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
