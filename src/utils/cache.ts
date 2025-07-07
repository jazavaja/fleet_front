// utils/cache.ts
export const fetchWithCache = async <T>(
    key: string,
    url: string,
    options: RequestInit = {},
    cacheDuration: number = 20 * 60 * 1000 // 20 دقیقه
  ): Promise<T> => {
    const now = Date.now();
  
    const cachedData = localStorage.getItem(`cache:${key}`);
    const cachedTime = localStorage.getItem(`cache_time:${key}`);
  
    if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < cacheDuration) {
      return JSON.parse(cachedData) as T;
    }
  
    const token = localStorage.getItem('token');
  
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
  
    const res = await fetch(url, {
      ...options,
      headers,
    });
  
    if (!res.ok) {
      throw new Error(`Error fetching data from ${url} | Status: ${res.status}`);
    }
  
    const data: T = await res.json();
  
    localStorage.setItem(`cache:${key}`, JSON.stringify(data));
    localStorage.setItem(`cache_time:${key}`, now.toString());
  
    return data;
  };
  