import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * ProtectedRoute - Wrapper component for admin pages
 * Redirects unauthenticated users to the login page
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/entrar" replace />;
  }

  // If authenticated, show the protected page
  return <>{children}</>;
}
