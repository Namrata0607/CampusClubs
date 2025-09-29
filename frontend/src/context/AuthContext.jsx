import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get the appropriate token key based on role
  const getTokenKey = (role) => {
    return role === 'admin' ? 'adminToken' : 'studentToken';
  };

  // Helper function to get current token from localStorage
  const getCurrentToken = () => {
    return localStorage.getItem('studentToken') || localStorage.getItem('adminToken');
  };

  // Check if we have a token in localStorage on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const currentToken = getCurrentToken();
        if (currentToken) {
          setToken(currentToken);
          // Get user details using the token
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${currentToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
          } else {
            // If token is invalid, remove all tokens
            localStorage.removeItem('studentToken');
            localStorage.removeItem('adminToken');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('studentToken');
        localStorage.removeItem('adminToken');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Clear any existing tokens first
      localStorage.removeItem('studentToken');
      localStorage.removeItem('adminToken');
      
      // Save token to localStorage based on user role
      const tokenKey = getTokenKey(data.user.role);
      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('adminToken');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};