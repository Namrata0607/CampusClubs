import { useAuth } from '../../context/useAuth';
import { useFetchWithFallback } from '../../hooks/useFetchWithFallback';
import Avatar from '../../components/common/Avatar';
import PlaceholderImage from '../../components/common/PlaceholderImage';

const Overview = () => {
  const { token, currentUser } = useAuth();
  const { data: dashboardData, loading, error, usingFallback } = useFetchWithFallback('/api/student/dashboard', token);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="h-12 w-12 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !usingFallback) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Avatar 
                name={currentUser?.name} 
                size="lg"
                src={currentUser?.avatar}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {currentUser?.name || 'Student'}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Your Campus Clubs Overview
                </p>
              </div>
            </div>
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
                    <strong>Demo Mode:</strong> Showing sample data
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Joined Clubs</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">{dashboardData?.joinedClubs?.length || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">{dashboardData?.pendingRequests?.length || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">{dashboardData?.upcomingEvents?.length || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Clubs */}
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900">My Clubs</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardData?.joinedClubs && dashboardData.joinedClubs.length > 0 ? (
            dashboardData.joinedClubs.map((club) => (
              <div key={club._id} className="bg-white overflow-hidden shadow rounded-lg h-full flex flex-col">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center mb-4">
                    <PlaceholderImage
                      src={club.logo}
                      alt={club.name}
                      size={40}
                      text={club.name?.charAt(0) || 'C'}
                      className="rounded-full"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{club.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{club.category}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 line-clamp-3">{club.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-100">
                    <a
                      href={`/student/my-club/${club._id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center"
                    >
                      View Details 
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10">
              <p className="text-center text-gray-500">You haven't joined any clubs yet.</p>
              <div className="mt-5 flex justify-center">
                <a
                  href="/student/explore"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Explore Clubs
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Requests */}
      {dashboardData.pendingRequests.length > 0 && (
        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">Pending Requests</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardData.pendingRequests.map((club) => (
              <div key={club._id} className="bg-white overflow-hidden shadow rounded-lg border border-yellow-200 h-full flex flex-col">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center mb-4">
                    <PlaceholderImage
                      src={club.logo}
                      alt={club.name}
                      size={40}
                      text={club.name?.charAt(0) || 'C'}
                      className="rounded-full"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{club.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{club.category}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 line-clamp-3">{club.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Pending approval
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;