'use client';

import { useAuth } from '@/context/AuthContext';

// Example component showing how to use auth context
export default function UserProfile() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={user!.profilePicture}
        alt={user!.name}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">{user!.name}</p>
        <p className="text-xs text-gray-500">{user!.plan}</p>
      </div>
    </div>
  );
}
