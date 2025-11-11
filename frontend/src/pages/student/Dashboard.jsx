import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Student Pages
import Overview from './Overview';
import ExploreClubs from './ExploreClubs';
import ClubDetails from './ClubDetails';
import MyClub from './MyClub';
import Notifications from './Notifications';
import Profile from './Profile';

// Student navigation is now handled in DashboardLayout component

const Dashboard = () => {
  const [pageTitle, setPageTitle] = useState('Student Dashboard');

  // Update page title based on current route
  useEffect(() => {
    const path = window.location.pathname;
    let title = 'Dashboard';
    
    if (path === '/student/explore') title = 'Explore Clubs';
    if (path === '/student/notifications') title = 'Notifications';
    if (path === '/student/profile') title = 'Profile';
    if (path.includes('/student/club/')) title = 'Club Details';
    if (path.includes('/student/my-club/')) title = 'My Club';
    
    setPageTitle(title);
  }, [window.location.pathname]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="explore" element={<ExploreClubs />} />
        <Route path="club/:id" element={<ClubDetails />} />
        <Route path="my-club/:clubId" element={<MyClub />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;