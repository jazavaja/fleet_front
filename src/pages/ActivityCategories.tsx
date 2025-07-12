import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

interface ActivityCategory {
  id: number;
  name: string;
  type: 'خدمت' | 'کالا' | 'کالا و خدمت';
}

const ActivityCategory = () => {
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [form, setForm] = useState<Omit<ActivityCategory, 'id'>>({
    name: '',
    type: 'خدمت',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
  const BASE_LIST_URL = `${API_BASE_URL}/activity-category/`;
  const AUTH_TOKEN = localStorage.getItem('access_token') || '';

  // فراخوانی داده‌ها از URL مشخص
  const fetchCategories = async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error(`خطا در دریافت داده‌ها - status: ${res.status}`);

      const data = await res.json();

      // فقط اگر data.results وجود داشته باشد
      if (Array.isArray(data.results)) {
        setCategories(
          data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.category_type === 'SERVICE'
              ? 'خدمت'
              : item.category_type === 'PRODUCT'
                ? 'کالا'
                : 'کالا و خدمت',
          }))
        );
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } else {
        console.error('فرمت داده نادرست است:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // بارگذاری اولیه و زمان تغییر سرچ
  useEffect(() => {
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());

    const url = `${BASE_LIST_URL}?${query.toString()}`;
    setCurrentUrl(url);
  }, [searchTerm]);

  // واکشی داده هر بار که currentUrl تغییر کنه
  useEffect(() => {
    if (currentUrl) fetchCategories(currentUrl);
  }, [currentUrl]);

  // ثبت فرم (افزودن/ویرایش)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const typeMap: Record<string, 'SERVICE' | 'PRODUCT' | 'BOTH'> = {
      'SERVICE': 'SERVICE',
      'PRODUCT': 'PRODUCT',
      'BOTH': 'BOTH',
    };
    const payload = {
      name: form.name,
      category_type: typeMap[form.type] || 'SERVICE',
    };

    console.log(form.type)


    console.log('sending PATCH payload:', payload);

    const url = editingId !== null
      ? `${API_BASE_URL}/activity-category/${editingId}/`
      : `${API_BASE_URL}/activity-category/`;

    const method = editingId !== null ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(editingId ? 'خطا در ویرایش' : 'خطا در افزودن');

      setForm({ name: '', type: 'خدمت' });
      setEditingId(null);

      // دوباره بارگذاری لیست
      if (currentUrl) fetchCategories(currentUrl);
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  // حذف
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف مطمئن هستید؟')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/activity-category/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error('خطا در حذف');

      // دوباره بارگذاری لیست
      if (currentUrl) fetchCategories(currentUrl);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-500 mb-4">ثبت رسته فعالیت</h1>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="نام رسته"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-1 w-1/3"
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as 'خدمت' | 'کالا' | 'کالا و خدمت' })
          }
          className="border rounded px-3 py-1"
        >
          <option value="SERVICE">خدمت</option>
          <option value="PRODUCT">کالا</option>
          <option value="BOTH">کالا و خدمت</option>
        </select>

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
              setForm({ name: '', type: 'خدمت' });
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
            <th className="border px-2 py-1">نوع</th>
            <th className="border px-2 py-1">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.type}</td>
                <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      setForm({
                        name: item.name,
                        type:
                          item.type === 'خدمت'
                            ? 'SERVICE'
                            : item.type === 'کالا'
                              ? 'PRODUCT'
                              : 'BOTH',
                      });
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
              <td colSpan={4} className="text-center text-gray-500 py-4">
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

export default ActivityCategory;