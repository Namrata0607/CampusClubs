import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useFetchWithFallback } from '../../hooks/useFetchWithFallback';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import { clubCategories } from '../../utils/fallbackData';

const ExploreClubs = () => {
  const { token } = useAuth();
  const { data: clubsData, loading, error, usingFallback, refetch } = useFetchWithFallback('/api/student/clubs', token);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [joinLoading, setJoinLoading] = useState({});
  const [joinMessage, setJoinMessage] = useState({ type: '', text: '', clubId: null });
  
  // Handle both direct array and object with clubs property
  const clubs = Array.isArray(clubsData) ? clubsData : (clubsData?.clubs || []);
  const categories = [...new Set(clubs.map(club => club?.category).filter(Boolean))].sort();

  const handleJoinRequest = async (clubId) => {
    setJoinLoading(prev => ({ ...prev, [clubId]: true }));
    setJoinMessage({ type: '', text: '', clubId: null });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/clubs/${clubId}/join`, {
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
      setJoinMessage({ 
        type: 'success', 
        text: 'Join request sent successfully!', 
        clubId 
      });
      
      // Clear message after 4 seconds
      setTimeout(() => {
        setJoinMessage({ type: '', text: '', clubId: null });
      }, 4000);
      
      // Refetch the data to get updated status
      refetch();
    } catch (err) {
      console.error('Failed to join club:', err);
      setJoinMessage({ 
        type: 'error', 
        text: err.message || 'Failed to send join request. Please try again.', 
        clubId 
      });
      
      // Clear error message after 4 seconds
      setTimeout(() => {
        setJoinMessage({ type: '', text: '', clubId: null });
      }, 4000);
    } finally {
      setJoinLoading(prev => ({ ...prev, [clubId]: false }));
    }
  };

  const filteredClubs = clubs.filter(club => {
    if (!club) return false;
    
    const matchesCategory = !selectedCategory || club.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      (club.name && club.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading clubs..." />;
  }

  if (error && !usingFallback) {
    return (
      <ErrorState 
        title="Failed to load clubs"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Explore Clubs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover and join clubs that match your interests
            </p>
          </div>
          {usingFallback && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Demo Mode:</strong> Showing sample clubs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-4 lg:space-y-0 lg:flex lg:items-end lg:space-x-6">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Clubs
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by name, description, or category..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="lg:w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <div className="relative">
              <select
                id="category"
                className="block w-full py-3 pl-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors appearance-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{String(category)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCategory) && (
            <div className="lg:w-auto">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="w-full lg:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <svg className="inline-block h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{filteredClubs.length}</span> of <span className="font-medium">{clubs.length}</span> clubs
            {(searchTerm || selectedCategory) && (
              <span className="ml-2 text-indigo-600">
                • Filtered results
              </span>
            )}
          </div>
          {categories.length > 0 && (
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-gray-500">Categories:</span>
              <div className="flex flex-wrap gap-1">
                {categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {String(category)}
                  </span>
                ))}
                {categories.length > 3 && (
                  <span className="text-xs text-gray-500">+{categories.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <div key={club._id} className="bg-white overflow-hidden shadow rounded-lg card-hover h-full flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <PlaceholderImage
                    src={club.logo || club.image}
                    alt={club.name}
                    size={48}
                    text={club.name?.charAt(0) || 'C'}
                    className="rounded-full"
                  />
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{club.name || 'Unnamed Club'}</h3>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                        {club.category || 'Other'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-4">
                  <p className="text-sm text-gray-500 line-clamp-3">{club.description || 'No description available.'}</p>
                </div>

                {/* Feedback Message */}
                {joinMessage.type && joinMessage.clubId === club._id && (
                  <div className={`flex items-center gap-2 p-3 mb-4 rounded-md text-sm ${
                    joinMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {joinMessage.type === 'success' ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span>{joinMessage.text}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="h-4 w-4 mr-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>
                      {Array.isArray(club.members) 
                        ? club.members.length 
                        : (club.members || club.memberCount || 0)
                      } members
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 flex-shrink-0">
                    <Link
                      to={`/student/club/${club._id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </Link>
                    
                    {club.status === 'member' ? (
                      <button
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 cursor-default"
                        disabled
                      >
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Member
                      </button>
                    ) : club.status === 'pending' ? (
                      <button
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 cursor-default"
                        disabled
                      >
                        <svg className="mr-1 h-3 w-3 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinRequest(club._id)}
                        disabled={joinLoading[club._id]}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joinLoading[club._id] ? (
                          <div className="mr-1 h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                        ) : (
                          <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        {joinLoading[club._id] ? 'Sending...' : 'Join'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No clubs found"
          message="Try adjusting your search or filter criteria to find clubs that match your interests."
          icon={
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('');
          }}
        />
      )}
    </div>
  );
};

export default ExploreClubs;