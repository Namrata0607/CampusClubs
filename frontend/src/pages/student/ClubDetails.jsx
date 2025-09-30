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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Member
                </span>
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
              {club.requirements && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {club.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {club.benefits && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {club.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {club.socialLinks && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {Object.entries(club.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
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
            <div className="space-y-4">
              {club.announcements && club.announcements.length > 0 ? (
                club.announcements.map((announcement) => (
                  <div key={announcement._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-gray-900">{announcement.title}</h4>
                          {getPriorityBadge(announcement.priority)}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{announcement.content}</p>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <span>By {announcement.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
                  <p className="mt-1 text-sm text-gray-500">Check back later for club updates and news.</p>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {club.members && club.members.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {club.members.map((member) => (
                    <div key={member._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          name={member.name} 
                          src={member.avatar}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          <p className="text-xs text-gray-400">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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