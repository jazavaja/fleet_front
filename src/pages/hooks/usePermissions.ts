// hooks/usePermissions.ts

import { useEffect, useState } from 'react';

export interface Permission {
  id: number;
  name: string;
  code_name: string;
}

const CACHE_KEY = 'cache:permissions';
const CACHE_TIME_KEY = 'cache_time:permissions';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      const now = Date.now();
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < CACHE_DURATION) {
        setPermissions(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/permissions/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('خطا در دریافت پرمیشن‌ها');

        const data = await res.json();

        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          code_name: p.codename,
        }));

        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());

        setPermissions(mapped);
      } catch (err) {
        setError((err as Error).message || 'خطا در بارگذاری پرمیشن‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const codeToIdMap = permissions.reduce<Record<string, number>>((acc, perm) => {
    acc[perm.code_name] = perm.id;
    return acc;
  }, {});

  return { permissions, codeToIdMap, loading, error };
};