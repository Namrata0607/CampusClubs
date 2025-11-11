import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Notifications = () => {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch announcements');
      
      const data = await response.json();
      
      // Extract all announcements from joined clubs
      const allAnnouncements = [];
      
      // Get announcements from the dashboard
      if (data.joinedClubs && Array.isArray(data.joinedClubs)) {
        data.joinedClubs.forEach(club => {
          if (club.announcements && Array.isArray(club.announcements)) {
            club.announcements.forEach(announcement => {
              allAnnouncements.push({
                ...announcement,
                clubName: club.name,
                clubId: club._id,
                clubLogo: club.logo || club.image,
              });
            });
          }
        });
      }
      
      // Sort by newest first
      allAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setAnnouncements(allAnnouncements);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (announcementId) => {
    setReadIds(new Set([...readIds, announcementId]));
  };

  const getFilteredAnnouncements = () => {
    if (filter === 'unread') {
      return announcements.filter(a => !readIds.has(a._id));
    } else if (filter === 'read') {
      return announcements.filter(a => readIds.has(a._id));
    }
    return announcements;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {filteredAnnouncements.length} {filter !== 'all' ? `${filter}` : ''} notification{filteredAnnouncements.length !== 1 ? 's' : ''}
            </p>
          </div>
          <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'all', name: 'All', count: announcements.length },
              { id: 'unread', name: 'Unread', count: announcements.filter(a => !readIds.has(a._id)).length },
              { id: 'read', name: 'Read', count: announcements.filter(a => readIds.has(a._id)).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length > 0 ? (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => {
            const createdBy = announcement.createdBy || {};
            const creatorName = createdBy.name || 'Admin';
            const creatorInitials = creatorName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
            const createdAt = announcement.createdAt ? new Date(announcement.createdAt) : new Date();
            const isRecent = (new Date() - createdAt) < 86400000; // Less than 24 hours
            const isUnread = !readIds.has(announcement._id);
            
            return (
              <div
                key={announcement._id}
                onClick={() => markAsRead(announcement._id)}
                className={`group cursor-pointer transition-all duration-200 ${
                  isUnread ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' : 'bg-white border-l-4 border-gray-200 hover:bg-gray-50'
                } rounded-lg p-5 shadow-sm hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {creatorInitials}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header with badges */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{creatorName}</p>
                        {isRecent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                            🔥 New
                          </span>
                        )}
                        {isUnread && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                            ● Unread
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {createdAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: createdAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>

                    {/* Club Name */}
                    <div className="mb-2 flex items-center gap-2">
                      <svg className="h-4 w-4 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-indigo-600">{announcement.clubName}</span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{announcement.content}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                      <span>⏰ {createdAt.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                      <span className="text-gray-400">Posted by {creatorName}</span>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {isUnread && (
                    <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-1.5 group-hover:bg-blue-600"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="mx-auto max-w-md">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === 'all' && 'You\'re all caught up! Announcements from your clubs will appear here.'}
              {filter === 'unread' && 'All your notifications have been read. Check the "All" tab to see them.'}
              {filter === 'read' && 'You haven\'t read any notifications yet. Check the "Unread" tab.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;