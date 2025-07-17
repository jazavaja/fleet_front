import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useGroups } from './hooks/useGroups';
import { usePermissions } from './hooks/usePermissions';
import { useGroupPermissions } from './hooks/useGroupPermissions';

const PermissionsManagement = () => {
  const { groups, loading: groupsLoading } = useGroups();
  const { permissions: allPermissions, codeToIdMap, loading: permsLoading } = usePermissions();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localPermissions, setLocalPermissions] = useState<number[]>([]);

  const {
    permissions: currentPerms,
    loading: groupPermLoading,
    savePermissions,
    refetch: refetchPermissions,
  } = useGroupPermissions(selectedGroupId || 0);

  // Sync local permissions with fetched permissions when they change
  useEffect(() => {
    setLocalPermissions(currentPerms);
  }, [currentPerms]);

  // Set initial group selection
  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups]);

  // Handle checkbox toggle by updating local state
  const handleToggle = (codeName: string) => {
    const id = codeToIdMap[codeName];
    setLocalPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  // Handle save button click
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await savePermissions(localPermissions);
      if (success) {
        await refetchPermissions();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('خطا در ذخیره:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (groupsLoading || permsLoading || !selectedGroupId) {
    return <DashboardLayout>در حال بارگذاری...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">مدیریت دسترسی‌ها</h2>

      <div className="bg-blue-50 text-blue-800 border border-blue-200 p-3 mb-4 rounded-md text-sm">
        لطفاً برای هر گروه دسترسی‌های مجاز را انتخاب کنید و در پایان روی{' '}
        <strong>ذخیره تغییرات</strong> کلیک کنید.
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
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* چک‌باکس‌های دسترسی */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {allPermissions.map((perm) => (
          <label key={perm.code_name} className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              checked={localPermissions.includes(perm.id)}
              onChange={() => handleToggle(perm.code_name)}
              disabled={groupPermLoading}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">{perm.name}</span>
          </label>
        ))}
      </div>

      {/* دکمه ذخیره */}
      <button
        onClick={handleSave}
        disabled={isSaving || groupPermLoading}
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