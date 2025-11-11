import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';
import { useFetchWithFallback } from '../../hooks/useFetchWithFallback';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Avatar from '../../components/common/Avatar';
import PlaceholderImage from '../../components/common/PlaceholderImage';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data: club, loading, error, usingFallback, refetch } = useFetchWithFallback(`/api/student/clubs/${id}`, token);
  const [membershipStatus, setMembershipStatus] = useState('none'); // none, pending, member
  const [activeTab, setActiveTab] = useState('overview');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState({ type: '', text: '' });

  const handleJoinRequest = async () => {
    setJoinLoading(true);
    setJoinMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/clubs/${id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send join request');
      }

      const data = await response.json();
      setMembershipStatus('pending');
      setJoinMessage({ 
        type: 'success', 
        text: 'Join request sent successfully! You will be notified once the admin reviews your request.' 
      });
      
      // Show toast notification
      toast.success('Join request sent successfully! 🎉');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setJoinMessage({ type: '', text: '' });
      }, 5000);
      
      refetch();
    } catch (err) {
      console.error('Failed to join club:', err);
      const errorMessage = err.message || 'Failed to send join request. Please try again.';
      setJoinMessage({ 
        type: 'error', 
        text: errorMessage
      });
      
      // Show toast notification
      toast.error(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setJoinMessage({ type: '', text: '' });
      }, 5000);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (!window.confirm('Are you sure you want to leave this club?')) {
      return;
    }

    setJoinLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/clubs/${id}/leave`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to leave club');
      }

      setMembershipStatus('none');
      toast.success('You have left the club');
      refetch();
    } catch (err) {
      console.error('Failed to leave club:', err);
      toast.error(err.message || 'Failed to leave club. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check membership status when club data loads
  useEffect(() => {
    if (club) {
      const checkMembership = async () => {
        try {
          // Make API call to get current user info and club status
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const dashboardData = await response.json();
            const currentUser = dashboardData.user;
            
            // Check if current user is in the club's members list
            if (club.members && Array.isArray(club.members)) {
              const userMember = club.members.find(
                m => m._id === currentUser._id || m.email === currentUser.email
              );
              
              if (userMember) {
                if (userMember.status === 'approved') {
                  setMembershipStatus('member');
                } else if (userMember.status === 'pending') {
                  setMembershipStatus('pending');
                } else {
                  setMembershipStatus('none');
                }
              } else {
                setMembershipStatus('none');
              }
            }
          }
        } catch (err) {
          console.error('Failed to check membership status:', err);
          // Fallback: check if we can determine from the members array directly
          if (club.members && Array.isArray(club.members) && club.members.length > 0) {
            const hasPendingRequest = club.members.some(m => m.status === 'pending');
            const isApproved = club.members.some(m => m.status === 'approved');
            
            if (isApproved) {
              setMembershipStatus('member');
            } else if (hasPendingRequest) {
              setMembershipStatus('pending');
            } else {
              setMembershipStatus('none');
            }
          }
        }
      };
      
      checkMembership();
    }
  }, [club, id, token]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', text: 'High Priority' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading club details..." />;
  }

  if (error && !usingFallback) {
    return (
      <ErrorState 
        title="Failed to load club details"
        message={error}
        onRetry={refetch}
        actionText="Try Again"
      />
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Club not found</h3>
        <p className="mt-2 text-sm text-gray-500">The club you're looking for doesn't exist.</p>
        <Link
          to="/student/explore"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and fallback indicator */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/explore"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Explore
        </Link>
        
        {usingFallback && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Showing sample data
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Club header */}
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl">
        {/* Banner area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center -mt-16">
              <div className="relative">
                <PlaceholderImage
                  src={club.image || club.logo}
                  alt={club.name}
                  size={96}
                  text={club.name?.charAt(0) || 'C'}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div className="ml-6 mt-12">
                <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {club.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {club.memberCount || club.members?.length || 0} members
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {membershipStatus === 'member' ? (
                <button
                  onClick={handleLeaveClub}
                  disabled={joinLoading}
                  className="inline-flex items-center px-6 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Leaving...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Leave Club
                    </>
                  )}
                </button>
              ) : membershipStatus === 'pending' ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <svg className="mr-2 h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Request Pending
                </span>
              ) : (
                <button
                  onClick={handleJoinRequest}
                  disabled={joinLoading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Join Club
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Join Request Feedback Message */}
          {joinMessage.text && (
            <div className={`mt-4 p-4 rounded-lg border ${
              joinMessage.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {joinMessage.type === 'success' ? (
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <p className="font-medium">{joinMessage.text}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <p className="text-lg text-gray-700 leading-relaxed">{club.description}</p>
          </div>

          {/* Quick Info Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {club.admin && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Avatar 
                    name={club.admin.name} 
                    src={club.admin.avatar}
                    size="sm"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Club Admin</p>
                    <p className="text-sm text-gray-500">{club.admin.name}</p>
                  </div>
                </div>
              </div>
            )}
            
            {club.meetingSchedule && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Meetings</p>
                    <p className="text-sm text-gray-500">
                      {club.meetingSchedule.frequency} {club.meetingSchedule.day}s at {club.meetingSchedule.time}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Community</p>
                  <p className="text-sm text-gray-500">
                    {club.memberCount || club.members?.length || 0} active members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: '📋' },
              { id: 'events', name: 'Events', icon: '📅' },
              { id: 'announcements', name: 'Announcements', icon: '📢' },
              { id: 'members', name: 'Members', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Club Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">About This Club</h3>
                <p className="text-base text-gray-700 leading-relaxed">{club.description}</p>
              </div>

              {club.requirements && club.requirements.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1z" clipRule="evenodd" />
                    </svg>
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {club.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {club.benefits && club.benefits.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.002v.952a3.066 3.066 0 01-2.812 3.002 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-3.002v-.952a3.066 3.066 0 012.812-3.002z" clipRule="evenodd" />
                    </svg>
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {club.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact & Social */}
              {club.socialLinks && Object.keys(club.socialLinks).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Connect With Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(club.socialLinks).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                          {platform === 'instagram' && (
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162 3.403 0 6.162 2.759 6.162 6.162 0 3.403-2.759 6.162-6.162 6.162-3.403 0-6.162-2.759-6.162-6.162zm2.889 0c0 1.821 1.452 3.273 3.273 3.273 1.821 0 3.273-1.452 3.273-3.273 0-1.821-1.452-3.273-3.273-3.273-1.821 0-3.273 1.452-3.273 3.273zm8.657-6.548c0 .796.645 1.441 1.441 1.441.795 0 1.44-.645 1.44-1.441-.001-.796-.645-1.441-1.44-1.441-.796.001-1.441.645-1.441 1.441z" />
                            </svg>
                          )}
                          {platform === 'twitter' && (
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          )}
                          {platform === 'linkedin' && (
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                          )}
                          {platform === 'facebook' && (
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          )}
                          {platform !== 'instagram' && platform !== 'twitter' && platform !== 'linkedin' && platform !== 'facebook' && platform.charAt(0).toUpperCase() + platform.slice(1)}
                          {(platform === 'instagram' || platform === 'twitter' || platform === 'linkedin' || platform === 'facebook') && (platform.charAt(0).toUpperCase() + platform.slice(1))}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {club.events && club.events.length > 0 ? (
                club.events.map((event) => (
                  <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                          {event.attendees && event.maxAttendees && (
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {event.attendees}/{event.maxAttendees} attendees
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">Check back later for upcoming club events.</p>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-3">
              {club.announcements && club.announcements.length > 0 ? (
                club.announcements.map((announcement, index) => {
                  const createdBy = announcement.createdBy || {};
                  const creatorName = createdBy.name || 'Admin';
                  const creatorInitials = creatorName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
                  const createdAt = announcement.createdAt ? new Date(announcement.createdAt) : new Date();
                  const isRecent = (new Date() - createdAt) < 86400000; // Less than 24 hours
                  
                  return (
                    <div 
                      key={announcement._id || index} 
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1 gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {creatorInitials}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{creatorName}</p>
                              {isRecent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  🔥 New
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                            
                            <div className="flex items-center text-xs text-gray-500 gap-3">
                              <span>📅 {createdAt.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: createdAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                              })}</span>
                              <span>⏰ {createdAt.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No announcements yet</h3>
                  <p className="mt-2 text-sm text-gray-500">Check back later for important club updates and news.</p>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {club.members && club.members.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {club.members.map((member) => {
                    const memberData = member.student || member;
                    const name = memberData.name || 'Unknown';
                    const email = memberData.email || '';
                    const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
                    const joinDate = new Date(member.joinedAt || member.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric'
                    });
                    
                    return (
                      <div key={member._id || memberData._id} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                          {initials}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 truncate w-full">{name}</h4>
                        {email && (
                          <p className="text-xs text-gray-500 truncate w-full mt-1">{email}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          📅 {joinDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                  <p className="mt-1 text-sm text-gray-500">Member information is not available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;