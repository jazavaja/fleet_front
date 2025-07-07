// hooks/useGroupPermissions.ts

import { useEffect, useState } from 'react';

const CACHE_KEY = (groupId: number) => `cache:group_permissions:${groupId}`;
const CACHE_TIME_KEY = (groupId: number) => `cache_time:group_permissions:${groupId}`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

export const useGroupPermissions = (groupId: number) => {
  const [permissions, setPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    const now = Date.now();
    const cachedData = localStorage.getItem(CACHE_KEY(groupId));
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY(groupId));

    if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < CACHE_DURATION) {
      setPermissions(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/permissions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('خطا در دریافت دسترسی‌ها');

      const data = await res.json();
      localStorage.setItem(CACHE_KEY(groupId), JSON.stringify(data.permissions));
      localStorage.setItem(CACHE_TIME_KEY(groupId), now.toString());
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchPermissions();
  }, [groupId]);

  const savePermissions = async (selectedPerms: number[]) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/permissions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: selectedPerms }),
      });

      if (!res.ok) throw new Error('خطا در ذخیره دسترسی‌ها');

      localStorage.removeItem(CACHE_KEY(groupId));
      localStorage.removeItem(CACHE_TIME_KEY(groupId));

      const updated = await res.json();
      setPermissions(updated.permissions || []);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const refetch = fetchPermissions;

  return { permissions, loading, savePermissions, refetch };
};