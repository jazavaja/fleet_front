import { useEffect, useState, useCallback } from 'react';

const CACHE_KEY = 'cache:groups';
const CACHE_TIME_KEY = 'cache_time:groups';
const CACHE_DURATION = 20 * 60 * 1000; // 20 دقیقه

interface Group {
  id: number;
  name: string;
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < CACHE_DURATION) {
        setGroups(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('access_token') || '';

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('خطا در دریافت گروه‌ها');

      const data = await res.json();

      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());

      setGroups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const removeCacheGroups = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  };

  return { groups, loading, removeCacheGroups, refetch: fetchGroups };
};