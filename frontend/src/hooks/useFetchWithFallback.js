import { useState, useEffect } from 'react';
import { getFallbackData } from '../utils/fallbackData';

export const useFetchWithFallback = (endpoint, token, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.warn(`Failed to fetch ${endpoint}, using fallback data:`, err);
        
        const fallbackData = getFallbackData(endpoint);
        if (fallbackData) {
          setData(fallbackData);
          setUsingFallback(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [endpoint, token, ...dependencies]);

  return { data, loading, error, usingFallback, refetch: () => {
    if (token) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setData(result);
        } catch (err) {
          console.warn(`Failed to fetch ${endpoint}, using fallback data:`, err);
          
          const fallbackData = getFallbackData(endpoint);
          if (fallbackData) {
            setData(fallbackData);
            setUsingFallback(true);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }};
};