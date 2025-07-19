import { useEffect, useState } from 'react';
import { useGroups } from './hooks/useGroups';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  group: number;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { groups, loading: groupsLoading } = useGroups();

  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserIdForPassword, setSelectedUserIdForPassword] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [form, setForm] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    group: NaN,
  });


  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    if (groups.length > 0 && !form.group) {
      setForm(f => ({ ...f, group: groups[0].id }));
    }
  }, [groups]);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/?search=${encodeURIComponent(search)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('خطا در واکشی کاربران');

      const data = await res.json();

      const mappedUsers: User[] = data.results.map((u: any) => ({
        id: u.id,
        firstName: u.first_name || '',
        lastName: u.last_name || '',
        phone: u.phone,
        password: '',
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!form.phone.trim() || !form.firstName.trim() || !form.password) return;

    try {
      const url = isEditing
        ? `${BASE_URL}/users/${form.id}/`
        : `${BASE_URL}/users/`;
      const method = isEditing ? 'PATCH' : 'POST';

      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        is_superuser: isSuperUser,
        is_staff: !isSuperUser,
        groups: form.group ? [form.group] : undefined,
        password: !isEditing ? form.password : undefined,
      };


      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        console.error('خطا در ذخیره کاربر:');
        return;
      }

      await fetchUsers();
      setIsEditing(false);
      setForm({
        id: 0,
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        group: groups.length > 0 ? groups[0].id : NaN,
      });
      setIsSuperUser(false);
    } catch (error) {
      console.error('خطا در ارسال فرم:', error);
    }
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setIsEditing(true);
    // اگر نیاز بود بعداً isSuperUser رو هم برای ویرایش ست کنیم اینجا اضافه می‌کنیم
  };

  const handlePasswordChange = async () => {
    if (!selectedUserIdForPassword || !newPassword.trim()) return;

    try {
      const payloadChangePassword = {
        new_password: newPassword,
      };
      const res = await fetch(`${BASE_URL}/change-password-super/${selectedUserIdForPassword}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadChangePassword),
      });

      if (!res.ok) throw new Error('خطا در تغییر پسورد');

      alert('پسورد با موفقیت تغییر یافت');
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      console.error('خطا در تغییر پسورد:', error);
      alert('خطا در تغییر پسورد');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف کاربر مطمئن هستید؟')) return;

    try {
      const res = await fetch(`${BASE_URL}/users/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('خطا در حذف کاربر');
        return;
      }

      await fetchUsers();
    } catch (error) {
      console.error('خطا در حذف کاربر:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">مدیریت کاربران</h1>

      {/* فرم افزودن / ویرایش */}
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
          disabled={isEditing} // فقط در حالت ویرایش غیرفعال است
          className="border px-3 py-2 rounded w-[180px]"
        />

        <select
          value={form.group}
          onChange={(e) => setForm({ ...form, group: Number(e.target.value) })}
          className="border px-3 py-2 rounded w-[180px]"
          disabled={groupsLoading || groups.length === 0 || isSuperUser}
        >
          {groupsLoading && <option>در حال بارگذاری گروه‌ها...</option>}
          {!groupsLoading && groups.length === 0 && <option>گروهی موجود نیست</option>}
          {!groupsLoading &&
            groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
        </select>

        <label className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="checkbox"
            checked={isSuperUser}
            onChange={(e) => setIsSuperUser(e.target.checked)}
          />
          <span>کاربر مدیریت اصلی (سوپریوزر)</span>
        </label>

        {groups.length === 0 && !isSuperUser && (
          <p className="text-red-500 w-full">
            تا زمانی که گروهی تعریف نشده، فقط می‌توان کاربر مدیریت اصلی (سوپریوزر) افزود.
          </p>
        )}

        <button
          type="submit"
          disabled={groups.length === 0 && !isSuperUser}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
                group: groups.length > 0 ? groups[0].id : NaN,
              });
              setIsSuperUser(false);
            }}
            className="text-red-500 mt-2"
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
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* جدول کاربران */}
      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-2 py-1">{user.id}</td>
                  <td className="border px-2 py-1">{user.firstName}</td>
                  <td className="border px-2 py-1">{user.lastName}</td>
                  <td className="border px-2 py-1">{user.phone}</td>
                  <td className="border px-2 py-1">{groups.find(g => g.id === user.group)?.name || ''}</td>
                  <td className="border px-2 py-1 space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={()=> handleEdit(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition disabled:opacity-50 focus:outline-none"
                  
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserIdForPassword(user.id);
                        setShowPasswordModal(true);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-900 text-white px-4 py-2 rounded shadow transition disabled:opacity-50 focus:outline-none"
                    >
                      ویرایش پسورد
                    </button>
                    
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-700 hover:bg-red-400 text-white px-4 py-2 m-2 rounded shadow transition disabled:opacity-50 focus:outline-none"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  هیچ کاربری یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      

      {/* Modal ویرایش پسورد */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-4">ویرایش پسورد</h3>
            <input
              type="password"
              placeholder="پسورد جدید (شامل حروف و عدد) "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                انصراف
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
