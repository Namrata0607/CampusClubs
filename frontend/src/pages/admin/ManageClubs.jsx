import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';
import { useFetchWithFallback } from '../../hooks/useFetchWithFallback';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ManageClubs = () => {
  const { token } = useAuth();
  const { data: clubsData, loading, error, usingFallback, refetch } = useFetchWithFallback('/api/admin/clubs', token);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, club: null });
  
  // Handle both direct array and object with clubs property
  const clubs = Array.isArray(clubsData) ? clubsData : (clubsData?.clubs || []);
  const categories = [...new Set(clubs.map(club => club?.category).filter(Boolean))].sort();

  const filteredClubs = clubs.filter(club => {
    if (!club) return false;
    
    const matchesCategory = !filterCategory || club.category === filterCategory;
    const matchesSearch = !searchTerm || 
      (club.name && club.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleDeleteClub = async (club) => {
    setDeleteModal({ isOpen: true, club });
  };

  const confirmDelete = async () => {
    const { club } = deleteModal;
    const loadingToast = toast.loading(`Deleting "${club.name}"...`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${club._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete club');
      }

      toast.success(`Club "${club.name}" deleted successfully!`, {
        id: loadingToast,
      });
      
      // Refetch data to update the list
      refetch();
      setDeleteModal({ isOpen: false, club: null });
    } catch (err) {
      console.error('Failed to delete club:', err);
      toast.error(`Failed to delete "${club.name}". Please try again.`, {
        id: loadingToast,
      });
      setDeleteModal({ isOpen: false, club: null });
    }
  };

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
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Clubs</h1>
              <p className="mt-2 text-lg text-gray-600">
                View and manage all clubs in the system
              </p>
            </div>
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

          {/* Action Bar */}
          <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-700">
                  {filteredClubs.length} of {clubs.length} clubs
                </span>
              </div>
              <Link
                to="/admin/clubs/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Club
              </Link>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 space-y-4 lg:space-y-0 lg:flex lg:items-end lg:space-x-6">
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
            
            <div className="lg:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="block w-full py-3 pl-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
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

            {/* Clear Filters */}
            {(searchTerm || filterCategory) && (
              <div className="lg:w-auto">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                  }}
                  className="w-full lg:w-auto px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg className="inline-block h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clubs Table */}
      {filteredClubs.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Club Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredClubs.map((club, index) => (
                  <tr key={club._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <PlaceholderImage
                            src={club.logo || club.image}
                            alt={club.name}
                            size={48}
                            text={club.name?.charAt(0) || 'C'}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {club.name || 'Unnamed Club'}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {club.description && club.description.length > 60
                              ? `${club.description.substring(0, 60)}...`
                              : club.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {club.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {Array.isArray(club.members) 
                            ? club.members.length 
                            : (club.members || club.memberCount || 0)
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-500">
                        {club.createdAt ? new Date(club.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/admin/clubs/${club._id}`}
                          className="inline-flex items-center p-2 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors duration-150 group"
                          title="View Club Details"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        <Link
                          to={`/admin/clubs/${club._id}/edit`}
                          className="inline-flex items-center p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150 group"
                          title="Edit Club"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteClub(club)}
                          className="inline-flex items-center p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-150 group"
                          title="Delete Club"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto max-w-md">
            {clubs.length === 0 ? (
              <>
                <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No clubs yet</h3>
                <p className="mt-2 text-gray-500">
                  Start building your community by creating the first club!
                </p>
                <div className="mt-6">
                  <Link
                    to="/admin/clubs/new"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Club
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No clubs match your search</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search terms or clearing the filters to see more results.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <Link
                    to="/admin/clubs/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Create New Club
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, club: null })}
        onConfirm={confirmDelete}
        title="Delete Club"
        message={`Are you sure you want to delete "${deleteModal.club?.name}"? This action cannot be undone and will remove all club data, members, and associated content.`}
        type="danger"
      />
    </div>
  );
};

export default ManageClubs;