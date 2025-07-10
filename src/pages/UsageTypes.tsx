import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

interface UsageType {
  id: number;
  name: string;
}

const UseageType = () => {
  const [usageTypes, setUsageTypes] = useState<UsageType[]>([]);
  const [form, setForm] = useState<Omit<UsageType, 'id'>>({ name: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
  const BASE_LIST_URL = `${API_BASE_URL}/usage-type/`;

  // فراخوانی داده‌ها از URL مشخص
  const fetchUsageTypes = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('خطا در دریافت داده‌ها');

      const data = await res.json();
      setUsageTypes(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
    } catch (error) {
      console.error('Error fetching usage types:', error);
    }
  };

  // بارگذاری اولیه و زمان تغییر سرچ
  useEffect(() => {
    // ساخت URL پایه همراه با جستجو (بدون page_size)
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());

    const url = `${BASE_LIST_URL}?${query.toString()}`;
    setCurrentUrl(url);
  }, [searchTerm]);

  // واکشی داده هر بار که currentUrl تغییر کنه
  useEffect(() => {
    if (currentUrl) fetchUsageTypes(currentUrl);
  }, [currentUrl]);

  // ثبت فرم (افزودن/ویرایش)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const url = editingId !== null
      ? `${API_BASE_URL}/usage-type/${editingId}/`
      : `${API_BASE_URL}/usage-type/`;
    const method = editingId !== null ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(editingId ? 'خطا در ویرایش' : 'خطا در افزودن');

      setForm({ name: '' });
      setEditingId(null);

      // دوباره بارگذاری صفحه فعلی
      if (currentUrl) fetchUsageTypes(currentUrl);
    } catch (error) {
      console.error('Error submitting usage type:', error);
    }
  };

  // حذف
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف مطمئن هستید؟')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/usage-type/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('خطا در حذف');

      if (currentUrl) fetchUsageTypes(currentUrl);
    } catch (error) {
      console.error('Error deleting usage type:', error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-500 mb-4">ثبت نوع کاربری</h1>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="نام نوع کاربری"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          className="border rounded px-3 py-1 w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          {editingId !== null ? 'ویرایش' : 'افزودن'}
        </button>
        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '' });
            }}
            className="text-red-500"
          >
            انصراف
          </button>
        )}
      </form>

      {/* جستجو */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجو..."
          className="border px-3 py-1 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول */}
      <table className="w-full table-auto border text-right">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">شناسه</th>
            <th className="border px-2 py-1">نام</th>
            <th className="border px-2 py-1">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {usageTypes.length > 0 ? (
            usageTypes.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      setForm({ name: item.name });
                      setEditingId(item.id);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                نتیجه‌ای یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* دکمه‌های صفحه‌بندی */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => prevUrl && setCurrentUrl(prevUrl)}
          disabled={!prevUrl}
        >
          قبلی
        </button>

        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => nextUrl && setCurrentUrl(nextUrl)}
          disabled={!nextUrl}
        >
          بعدی
        </button>
      </div>
    </DashboardLayout>
  );
};

export default UseageType;
