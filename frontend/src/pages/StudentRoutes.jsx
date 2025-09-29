import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Dashboard from './student/Dashboard';

const StudentRoutes = () => {
  const { currentUser } = useAuth();

  // If not student, redirect to appropriate dashboard
  if (currentUser?.role !== 'student') {
    return <Navigate to={currentUser?.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <Dashboard />;
};

export default StudentRoutes;