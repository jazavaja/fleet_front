import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useGroups } from './hooks/useGroups';

interface Group {
    id: number;
    name: string;
}
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
const GroupManagement = () => {

    const { groups, loading, removeCacheGroups, refetch } = useGroups();

    const [form, setForm] = useState<Group>({ id: 0, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const token = localStorage.getItem('access_token') || '';


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `${BASE_URL}/groups/${form.id}/` : `${BASE_URL}/groups/`;
            const method = isEditing ? 'PATCH' : 'POST';

            const payload = {
                name: form.name
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('خطا در ذخیره گروه');

            // ✅ دوباره دیتا رو فچ کن
            removeCacheGroups(); // کش رو پاک کن
            await refetch();     // دوباره دیتا رو از سرور بخون

            setIsEditing(false);
            setForm({ id: 0, name: '' });
        } catch (error) {
            console.error('خطا:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('آیا از حذف گروه مطمئن هستید؟')) return;

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${BASE_URL}/groups/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error('خطا در حذف گروه');

            // ✅ دوباره دیتا رو فچ کن
            removeCacheGroups();
            await refetch();
        } catch (error) {
            console.error('خطا:', error);
        }
    };

    const handleEdit = (group: Group) => {
        setForm(group);
        setIsEditing(true);
    };


    const filtered = groups.filter((g) => g.name.includes(search));
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6 text-gray-700">مدیریت گروه‌ها</h2>
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mb-4 text-sm">
                ⚠️ برای جلوگیری از بروز خطا، لطفاً در وارد کردن نام گروه‌ها فقط از **حروف انگلیسی** استفاده کنید.
                <span className="block mt-1">برای مثال به‌جای <span className="font-bold">مدیران</span> از <span className="font-bold">Modiran</span> استفاده کنید.</span>
            </div>
            {/* فرم ثبت/ویرایش گروه */}
            <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="نام گروه"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border px-4 py-2 rounded w-[250px]"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {isEditing ? 'ویرایش' : 'افزودن'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ id: 0, name: '' });
                            setIsEditing(false);
                        }}
                        className="text-red-600"
                    >
                        انصراف
                    </button>
                )}
            </form>

            {/* جستجو */}
            <input
                type="text"
                placeholder="جستجو..."
                className="border px-3 py-2 mb-4 rounded w-1/3"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
            />

            {/* جدول */}
            <table className="w-full table-auto border text-right">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">شناسه</th>
                        <th className="border px-2 py-1">نام گروه</th>
                        <th className="border px-2 py-1">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((group) => (
                        <tr key={group.id}>
                            <td className="border px-2 py-1">{group.id}</td>
                            <td className="border px-2 py-1">{group.name}</td>
                            <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                                <button
                                    onClick={() => handleEdit(group)}
                                    className="text-blue-600 hover:underline"
                                >
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                    {paginated.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center py-4 text-gray-500">
                                گروهی یافت نشد.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* صفحه‌بندی */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border px-3 py-1 rounded hover:bg-gray-100"
                    >
                        قبلی
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`border px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border px-3 py-1 rounded hover:bg-gray-100"
                    >
                        بعدی
                    </button>
                </div>
            )}
        </DashboardLayout>



    );
};

export default GroupManagement;
