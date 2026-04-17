import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}