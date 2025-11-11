import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/useAuth';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageClubs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch clubs');
      const data = await response.json();
      setClubs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load clubs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async (clubId, clubName) => {
    if (window.confirm(`Are you sure you want to delete "${clubName}"? This action cannot be undone.`)) {
      const loadingToast = toast.loading('Deleting club...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clubs/${clubId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete club');
        setClubs(clubs.filter(c => c._id !== clubId));
        toast.success('Club deleted successfully!', { id: loadingToast });
      } catch (err) {
        toast.error(err.message, { id: loadingToast });
      }
    }
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = !searchTerm || 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !filterCategory || club.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(clubs.map(c => c.category).filter(Boolean))].sort();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Clubs</h1>
            <p className="text-gray-600 mt-1">You have {clubs.length} club{clubs.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            to="/admin/clubs/new"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Create Club
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by club name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || filterCategory) && (
          <p className="text-sm text-gray-600">
            Found {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
            </svg>
            <p className="text-lg font-medium">No clubs found</p>
            {clubs.length === 0 ? (
              <p className="mt-2">Create your first club to get started!</p>
            ) : (
              <p className="mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <div key={club._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Club Image */}
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <PlaceholderImage 
                  src={club.logo} 
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Club Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{club.category}</p>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>

                {/* Stats */}
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    👥 {club.members?.filter(m => m.status === 'approved').length || 0} members
                  </span>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded">
                    📋 {club.members?.filter(m => m.status === 'pending').length || 0} pending
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/admin/clubs/${club._id}`)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => handleDeleteClub(club._id, club.name)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
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
  );
};

export default ManageClubs;