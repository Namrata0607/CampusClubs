import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ClubOverview = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', venue: '' });
  const [announcementForm, setAnnouncementForm] = useState({ content: '' });

  useEffect(() => {
    fetchClubData();
  }, [clubId]);

  useEffect(() => {
    if (activeTab === 'events' && events.length === 0) {
      fetchEvents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'announcements' && announcements.length === 0) {
      fetchAnnouncements();
    }
  }, [activeTab]);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch club');
      const data = await response.json();
      setClub(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load club details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      toast.error('Failed to load announcements');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) {
      toast.error('Please fill in required fields (title, date)');
      return;
    }

    const loadingToast = toast.loading('Creating event...');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) throw new Error('Failed to create event');
      const newEvent = await response.json();
      setEvents([newEvent, ...events]);
      setEventForm({ title: '', description: '', date: '', time: '', venue: '' });
      setShowEventForm(false);
      toast.success('Event created successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating event...');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${editingEvent._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) throw new Error('Failed to update event');
      const updatedEvent = await response.json();
      setEvents(events.map(e => e._id === editingEvent._id ? updatedEvent : e));
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', time: '', venue: '' });
      toast.success('Event updated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const loadingToast = toast.loading('Deleting event...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete event');
        setEvents(events.filter(e => e._id !== eventId));
        toast.success('Event deleted successfully!', { id: loadingToast });
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
      }
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.content.trim()) {
      toast.error('Announcement content cannot be empty');
      return;
    }

    const loadingToast = toast.loading('Creating announcement...');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementForm),
      });

      if (!response.ok) throw new Error('Failed to create announcement');
      const newAnnouncement = await response.json();
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementForm({ content: '' });
      setShowAnnouncementForm(false);
      toast.success('Announcement posted successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const loadingToast = toast.loading('Deleting announcement...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/announcements/${announcementId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete announcement');
        setAnnouncements(announcements.filter(a => a._id !== announcementId));
        toast.success('Announcement deleted successfully!', { id: loadingToast });
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
      }
    }
  };

  const handleDeleteClub = async () => {
    if (window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      const loadingToast = toast.loading('Deleting club...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete club');
        toast.success('Club deleted successfully!', { id: loadingToast });
        navigate('/admin/clubs');
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center p-6">Error: {error}</div>;
  if (!club) return <div className="text-center p-6">Club not found</div>;

  const approvedMembers = club.members?.filter(m => m.status === 'approved') || [];
  const pendingMembers = club.members?.filter(m => m.status === 'pending') || [];

  return (
    <div className="space-y-6">
      {/* Club Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <PlaceholderImage 
                src={club.logo} 
                alt={club.name}
                className="w-24 h-24 rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
                <p className="text-gray-500 mt-1">{club.category}</p>
                <p className="text-gray-700 mt-2">{club.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/clubs')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleDeleteClub}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Club
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" role="tablist">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'events', label: 'Events', icon: '📅' },
              { id: 'announcements', label: 'Announcements', icon: '📢' },
              { id: 'members', label: 'Members', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                role="tab"
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-indigo-600 font-medium">Approved Members</div>
                  <div className="text-2xl font-bold text-indigo-900">{approvedMembers.length}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Pending Requests</div>
                  <div className="text-2xl font-bold text-yellow-900">{pendingMembers.length}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Events</div>
                  <div className="text-2xl font-bold text-blue-900">{events.length || 0}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Category</label>
                    <p className="text-gray-900">{club.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <p className="text-gray-900">{club.description}</p>
                  </div>
                  {club.rules && (
                    <div>
                      <label className="text-sm text-gray-600">Rules</label>
                      <p className="text-gray-900">{club.rules}</p>
                    </div>
                  )}
                  {club.maxMembers && (
                    <div>
                      <label className="text-sm text-gray-600">Max Members</label>
                      <p className="text-gray-900">{club.maxMembers}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setShowEventForm(true);
                  setEditingEvent(null);
                  setEventForm({ title: '', description: '', date: '', time: '', venue: '' });
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                + New Event
              </button>

              {showEventForm && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h3>
                  <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Event title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Event description"
                        rows="3"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Event venue"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEventForm(false);
                          setEditingEvent(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No events yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            {event.time && <span>🕒 {event.time}</span>}
                            {event.venue && <span>📍 {event.venue}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setEventForm({
                                title: event.title,
                                description: event.description || '',
                                date: event.date?.split('T')[0] || '',
                                time: event.time || '',
                                venue: event.venue || '',
                              });
                              setShowEventForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setShowAnnouncementForm(true);
                  setAnnouncementForm({ content: '' });
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                + New Announcement
              </button>

              {showAnnouncementForm && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Post New Announcement</h3>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                      <textarea
                        value={announcementForm.content}
                        onChange={(e) => setAnnouncementForm({ content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Write your announcement..."
                        rows="4"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Post Announcement
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAnnouncementForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No announcements yet. Post one to inform members!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-gray-900">{announcement.content}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            Posted by {announcement.createdBy?.name} on {new Date(announcement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement._id)}
                          className="text-red-600 hover:text-red-700 text-sm ml-4"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Approved Members</div>
                  <div className="text-2xl font-bold text-green-900">{approvedMembers.length}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Pending Requests</div>
                  <div className="text-2xl font-bold text-yellow-900">{pendingMembers.length}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Approved Members</h3>
                {approvedMembers.length === 0 ? (
                  <p className="text-gray-500">No approved members yet.</p>
                ) : (
                  <div className="space-y-2">
                    {approvedMembers.map(member => (
                      <div key={member._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{member.student?.name}</p>
                          <p className="text-sm text-gray-500">{member.student?.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Approved</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h3>
                {pendingMembers.length === 0 ? (
                  <p className="text-gray-500">No pending requests.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingMembers.map(member => (
                      <div key={member._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{member.student?.name}</p>
                          <p className="text-sm text-gray-500">{member.student?.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubOverview;
