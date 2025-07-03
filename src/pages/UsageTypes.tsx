import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

interface UsageType {
  id: number;
  name: string;
}

const UseageType = () => {
  const [usageTypes, setUsageTypes] = useState<UsageType[]>([
    { id: 1, name: 'یخچالی' },
    { id: 2, name: 'وانتی' },
    { id: 3, name: 'سواری' },
    { id: 4, name: 'کامیون' },
    { id: 5, name: 'تریلی' },
    { id: 6, name: 'موتوری' },
    { id: 7, name: 'اتوبوس' },
    { id: 8, name: 'لندرور' },
    { id: 9, name: 'مزدا یخچال' },
  ]);

  const [form, setForm] = useState<UsageType>({ id: 0, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // -----------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing) {
      setUsageTypes(usageTypes.map((item) => (item.id === form.id ? form : item)));
      setIsEditing(false);
    } else {
      const newId = usageTypes.length > 0 ? Math.max(...usageTypes.map((u) => u.id)) + 1 : 1;
      setUsageTypes([...usageTypes, { id: newId, name: form.name }]);
    }
    setForm({ id: 0, name: '' });
  };

  const handleEdit = (item: UsageType) => {
    setForm(item);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('آیا از حذف مطمئن هستید؟')) {
      setUsageTypes(usageTypes.filter((item) => item.id !== id));
    }
  };

  const filteredData = usageTypes.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-1 w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          {isEditing ? 'ویرایش' : 'افزودن'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setForm({ id: 0, name: '' });
            }}
            className="text-red-500"
          >
            انصراف
          </button>
        )}
      </form>

      {/* سرچ */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجو..."
          className="border px-3 py-1 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // ریست صفحه به ۱ بعد سرچ
          }}
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
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.id}</td>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleEdit(item)}
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
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                نتیجه‌ای یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            قبلی
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            بعدی
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UseageType;
