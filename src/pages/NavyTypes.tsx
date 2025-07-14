import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/navytypes/`;


interface NavyType {
  id: number;
  name: string;
  logo?: string;
}

const NavyTypeDashboard = () => {
  const TOKEN = localStorage.getItem('access_token');
  const [types, setTypes] = useState<NavyType[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [editingType, setEditingType] = useState<NavyType | null>(null);
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTypes = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error("خطا در واکشی");

      const data = await response.json();
      setTypes(Array.isArray(data) ? data : data.results || []);
      
    } catch (err) {
      console.error("خطا در دریافت داده‌ها", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/navytypes/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`, // فقط اینو بفرست
          // ❌ Content-Type رو دستی نذار
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("خطای سرور:", errorData);
  
        const errorMsg =
          errorData?.detail ||
          Object.values(errorData).flat().join(" | ") ||
          "خطای نامشخص در ارسال";
  
        alert("❌ خطا در ارسال: " + errorMsg);
        return;
      }
  
      alert("✅ نوع جدید با موفقیت اضافه شد");
      setName("");
      setLogo(null);
      fetchTypes(); // ری‌لود لیست
    } catch (err) {
      console.error("⛔ خطای غیرمنتظره:", err);
      const errorMessage = err instanceof Error ? err.message : "خطای نامشخص";
      alert("افزودن ناموفق بود: " + errorMessage);
    }
  };
  

  const handleDelete = async (id: number) => {
    if (!window.confirm("حذف شود؟")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 204) {
        fetchTypes(); // Refresh
      } else {
        throw new Error("خطا در حذف");
      }
    } catch (err) {
      console.error("خطا در حذف", err);
    }
  };

  const handleEdit = (type: NavyType) => {
    setEditingType(type);
    setEditName(type.name);
    setEditLogo(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingType) return;

    const formData = new FormData();
    formData.append("name", editName);
    if (editLogo) formData.append("logo", editLogo);

    try {
      const response = await fetch(`${API_URL}${editingType.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("خطای سرور:", errorData);

        const errorMsg =
          errorData?.detail ||
          Object.values(errorData).flat().join(" | ") ||
          "خطای نامشخص در بروزرسانی";

        alert("❌ خطا در بروزرسانی: " + errorMsg);
        return;
      }

      alert("✅ نوع با موفقیت بروزرسانی شد");
      setIsEditModalOpen(false);
      setEditingType(null);
      setEditName("");
      setEditLogo(null);
      fetchTypes(); // Refresh list
    } catch (err) {
      console.error("⛔ خطای غیرمنتظره:", err);
      const errorMessage = err instanceof Error ? err.message : "خطای نامشخص";
      alert("بروزرسانی ناموفق بود: " + errorMessage);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingType(null);
    setEditName("");
    setEditLogo(null);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">مدیریت نوع ناوگان</h1>
          <p className="text-gray-600">افزودن و مدیریت انواع مختلف ناوگان دریایی</p>
        </div>

        {/* Add Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن نوع جدید
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام نوع ناوگان
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="مثال: باری "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لوگو یا تصویر
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition duration-200 shadow-lg flex items-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                افزودن نوع
              </button>
            </div>
          </form>
        </div>

        {/* Types List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              لیست انواع ناوگان
            </h2>
            <p className="text-gray-600 mt-1">مدیریت انواع موجود در سیستم</p>
          </div>
          
          {types.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ نوعی یافت نشد</h3>
              <p className="text-gray-500">برای شروع، یک نوع جدید اضافه کنید</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {types.map((type) => (
                <div
                  key={type.id}
                  className="p-6 hover:bg-gray-50 transition duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      {type.logo ? (
                        <img
                          src={`${type.logo}`}
                          alt={type.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-gray-200">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-gray-500">شناسه: {type.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(type)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-medium flex items-center transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ویرایش نوع ناوگان
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-1">ویرایش اطلاعات نوع: {editingType.name}</p>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام نوع ناوگان
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="نام جدید نوع ناوگان"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لوگو یا تصویر جدید (اختیاری)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setEditLogo(e.target.files?.[0] || null)}
                  />
                </div>
                {editingType.logo && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">لوگوی فعلی:</p>
                    <img
                      src={`${editingType.logo}`}
                      alt={editingType.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-lg"
                >
                  بروزرسانی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NavyTypeDashboard;
