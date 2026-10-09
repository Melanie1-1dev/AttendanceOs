import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function ProtectedRoute({ unauthenticatedElement }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  return <Outlet />;
}
