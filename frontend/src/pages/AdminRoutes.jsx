import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Dashboard from './admin/Dashboard';
import ManageClubs from './admin/ManageClubs';
import ClubDetails from './admin/ClubDetails';
import CreateClub from './admin/CreateClub';
import ManageRequests from './admin/ManageRequests';
import Members from './admin/Members';
import Profile from './admin/Profile';

const AdminRoutes = () => {
  const { currentUser } = useAuth();

  // If not admin, redirect to appropriate dashboard
  if (currentUser?.role !== 'admin') {
    return <Navigate to={currentUser?.role === 'student' ? '/student' : '/'} replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clubs" element={<ManageClubs />} />
        <Route path="/clubs/new" element={<CreateClub />} />
        <Route path="/clubs/:clubId" element={<ClubDetails />} />
        <Route path="/requests" element={<ManageRequests />} />
        <Route path="/members" element={<Members />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminRoutes;