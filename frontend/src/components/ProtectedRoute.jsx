import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from './SkeletonLoader';

export function ProtectedRoute({ roles }) {
  const { user, loading, sessionExpired } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error(sessionExpired ? 'Session expired. Please log in again.' : 'Please log in to continue.', {
        id: 'auth-denied',
      });
      return;
    }

    if (roles && !roles.includes(user.role)) {
      toast.error('Permission denied.', { id: 'auth-role-denied' });
    }
  }, [loading, user, sessionExpired, roles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <SkeletonLoader className="h-72 w-full max-w-4xl rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <SkeletonLoader className="h-72 w-full max-w-3xl rounded-3xl" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
}
