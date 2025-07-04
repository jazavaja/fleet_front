import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

interface Group {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

const mockGroups: Group[] = [
  { id: 1, name: 'Modiran' },
  { id: 2, name: 'Karmandan' },
];

const mockPermissions: Permission[] = [
  { id: 1, name: 'مدیریت_ناوگان_تجاری' },
  { id: 2, name: 'مدیریت_مناطق_فعالیت' },
  { id: 3, name: 'مدیریت_انواع_کاربری' },
  { id: 4, name: 'مدیریت_رسته_فعالیت' },
  { id: 5, name: 'مدیریت_درخواستها' },
  { id: 5, name: 'مدیریت_کابران' },
  { id: 5, name: 'مدیریت_گزارشات' },
];

const PermissionsManagement = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(mockGroups[0].id);
  const [groupPermissions, setGroupPermissions] = useState<Record<number, number[]>>({
    1: [1, 2, 4],
    2: [5],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentPerms = groupPermissions[selectedGroupId] || [];

  const handleToggle = (permId: number) => {
    const updated = currentPerms.includes(permId)
      ? currentPerms.filter((id) => id !== permId)
      : [...currentPerms, permId];

    setGroupPermissions({
      ...groupPermissions,
      [selectedGroupId]: updated,
    });

    setSaveSuccess(false); // مخفی کردن پیام موفقیت قبلی
  };

  const handleSave = async () => {
    setIsSaving(true);
    // شبیه‌سازی ارسال درخواست – بعداً به جای این از axios.post استفاده کن
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);

    // مثال اتصال به بک‌اند:
    // await axios.post('/api/groups/' + selectedGroupId + '/permissions/', groupPermissions[selectedGroupId]);
  };

  return (
    <DashboardLayout>

    
      <h2 className="text-2xl font-bold mb-4 text-gray-700">مدیریت دسترسی‌ها</h2>

      <div className="bg-blue-50 text-blue-800 border border-blue-200 p-3 mb-4 rounded-md text-sm">
        لطفاً برای هر گروه دسترسی‌های مجاز را انتخاب کنید و در پایان روی <strong>ذخیره تغییرات</strong> کلیک کنید.
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-600">انتخاب گروه:</label>
        <select
          value={selectedGroupId}
          onChange={(e) => {
            setSelectedGroupId(parseInt(e.target.value));
            setSaveSuccess(false);
          }}
          className="border rounded px-4 py-2 w-[250px]"
        >
          {mockGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* چک‌باکس‌های دسترسی */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {mockPermissions.map((perm) => (
          <label key={perm.id} className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              checked={currentPerms.includes(perm.id)}
              onChange={() => handleToggle(perm.id)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">{perm.name}</span>
          </label>
        ))}
      </div>

      {/* دکمه ذخیره */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
      </button>

      {/* پیام موفقیت */}
      {saveSuccess && (
        <div className="mt-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded text-sm">
          ✅ دسترسی‌های گروه با موفقیت ذخیره شدند.
        </div>
      )}
    </DashboardLayout>
  );
};

export default PermissionsManagement;
