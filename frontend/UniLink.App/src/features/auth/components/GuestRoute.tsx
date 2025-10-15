import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * GuestRoute - Wrapper component for auth pages (login, register)
 * Redirects authenticated users to the admin dashboard
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If user is authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/painel" replace />;
  }

  // If not authenticated, show the auth page
  return <>{children}</>;
}
