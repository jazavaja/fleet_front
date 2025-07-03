import { useState } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  group: string; // نام گروه فعلی (مثلاً: مدیران)
}

const mockGroups = ['مدیران', 'کارمندان', 'اپراتورها'];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'علی',
      lastName: 'رضایی',
      phone: '09123456789',
      password: '1234',
      group: 'مدیران',
    },
  ]);
  const [form, setForm] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    group: mockGroups[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim() || !form.firstName.trim() || !form.password) return;

    if (isEditing) {
      setUsers(users.map(u => (u.id === form.id ? form : u)));
      setIsEditing(false);
    } else {
      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...form, id: newId }]);
    }

    setForm({
      id: 0,
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      group: mockGroups[0],
    });
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف کاربر مطمئن هستید؟')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const filtered = users.filter(
    u =>
      u.phone.includes(search) ||
      u.firstName.includes(search) ||
      u.lastName.includes(search) ||
      u.group.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">مدیریت کاربران</h1>

      {/* فرم ثبت / ویرایش */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="نام"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="border px-3 py-2 rounded w-[180px]"
        />
        <input
          type="text"
          placeholder="نام خانوادگی"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="border px-3 py-2 rounded w-[180px]"
        />
        <input
          type="text"
          placeholder="موبایل"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border px-3 py-2 rounded w-[180px]"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border px-3 py-2 rounded w-[180px]"
        />
        <select
          value={form.group}
          onChange={(e) => setForm({ ...form, group: e.target.value })}
          className="border px-3 py-2 rounded w-[180px]"
        >
          {mockGroups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'ویرایش' : 'افزودن'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setForm({
                id: 0,
                firstName: '',
                lastName: '',
                phone: '',
                password: '',
                group: mockGroups[0],
              });
            }}
            className="text-red-500 mt-2"
          >
            انصراف
          </button>
        )}
      </form>

      {/* فیلتر جستجو */}
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

      {/* جدول کاربران */}
      <table className="w-full table-auto border text-right">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">شناسه</th>
            <th className="border px-2 py-1">نام</th>
            <th className="border px-2 py-1">نام خانوادگی</th>
            <th className="border px-2 py-1">موبایل</th>
            <th className="border px-2 py-1">گروه</th>
            <th className="border px-2 py-1">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((user) => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.id}</td>
              <td className="border px-2 py-1">{user.firstName}</td>
              <td className="border px-2 py-1">{user.lastName}</td>
              <td className="border px-2 py-1">{user.phone}</td>
              <td className="border px-2 py-1">{user.group}</td>
              <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600 hover:underline"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                هیچ کاربری یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            قبلی
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`border px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            بعدی
          </button>
        </div>
      )}
    </>
  );
};

export default UserManagement;
