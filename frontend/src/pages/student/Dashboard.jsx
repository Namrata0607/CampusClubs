import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  HomeIcon, 
  SearchIcon, 
  UserGroupIcon,
  CalendarIcon, 
  BellIcon
} from '@heroicons/react/outline';

// Student Pages
import Overview from './Overview';
import ExploreClubs from './ExploreClubs';
import ClubDetails from './ClubDetails';

const studentNavigation = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: HomeIcon
  },
  {
    name: 'Explore Clubs',
    href: '/student/explore',
    icon: SearchIcon
  },
  {
    name: 'My Clubs',
    href: '/student/clubs',
    icon: UserGroupIcon
  },
  {
    name: 'Events',
    href: '/student/events',
    icon: CalendarIcon
  },
  {
    name: 'Announcements',
    href: '/student/announcements',
    icon: BellIcon
  }
];

const Dashboard = () => {
  const [pageTitle, setPageTitle] = useState('Student Dashboard');

  // Update page title based on current route
  useEffect(() => {
    const path = window.location.pathname;
    let title = 'Dashboard';
    
    if (path === '/student/explore') title = 'Explore Clubs';
    if (path === '/student/clubs') title = 'My Clubs';
    if (path === '/student/events') title = 'Upcoming Events';
    if (path === '/student/announcements') title = 'Announcements';
    if (path.includes('/student/club/')) title = 'Club Details';
    
    setPageTitle(title);
  }, [window.location.pathname]);

  return (
    <DashboardLayout navigation={studentNavigation} title={pageTitle}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="explore" element={<ExploreClubs />} />
        <Route path="club/:id" element={<ClubDetails />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;