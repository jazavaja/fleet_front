import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/navybrands/`;
const NAVY_SIZES_URL = `${API_BASE_URL}/navysizes/`;
const TOKEN = localStorage.getItem('access_token');

interface NavySize {
  id: number;
  name: string;
  logo?: string;
  types: any[];
}

interface NavyBrand {
  id: number;
  name: string;
  logo?: string;
  sizes: NavySize[];
}

const NavyBrandDashboard = () => {
  const [brands, setBrands] = useState<NavyBrand[]>([]);
  const [sizes, setSizes] = useState<NavySize[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  // Edit states
  const [editingBrand, setEditingBrand] = useState<NavyBrand | null>(null);
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [editSelectedSizes, setEditSelectedSizes] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchBrands = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error("خطا در واکشی");

      const data = await response.json();
      setBrands(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("خطا در دریافت داده‌ها", err);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch(NAVY_SIZES_URL, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error("خطا در واکشی سایزها");

      const data = await response.json();
      setSizes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("خطا در دریافت سایزها", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);
    selectedSizes.forEach(sizeId => {
      formData.append("size_ids", sizeId.toString());
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
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
          "خطای نامشخص در ارسال";

        alert("❌ خطا در ارسال: " + errorMsg);
        return;
      }

      alert("✅ برند جدید با موفقیت اضافه شد");
      setName("");
      setLogo(null);
      setSelectedSizes([]);
      fetchBrands();
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
        fetchBrands();
      } else {
        throw new Error("خطا در حذف");
      }
    } catch (err) {
      console.error("خطا در حذف", err);
    }
  };

  const handleEdit = (brand: NavyBrand) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setEditLogo(null);
    setEditSelectedSizes(brand.sizes.map(size => size.id));
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBrand) return;

    const formData = new FormData();
    formData.append("name", editName);
    if (editLogo) formData.append("logo", editLogo);
    editSelectedSizes.forEach(sizeId => {
      formData.append("size_ids", sizeId.toString());
    });

    try {
      const response = await fetch(`${API_URL}${editingBrand.id}/`, {
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

      alert("✅ برند با موفقیت بروزرسانی شد");
      setIsEditModalOpen(false);
      setEditingBrand(null);
      setEditName("");
      setEditLogo(null);
      setEditSelectedSizes([]);
      fetchBrands();
    } catch (err) {
      console.error("⛔ خطای غیرمنتظره:", err);
      const errorMessage = err instanceof Error ? err.message : "خطای نامشخص";
      alert("بروزرسانی ناموفق بود: " + errorMessage);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBrand(null);
    setEditName("");
    setEditLogo(null);
    setEditSelectedSizes([]);
  };

  const handleSizeToggle = (sizeId: number) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handleEditSizeToggle = (sizeId: number) => {
    setEditSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  useEffect(() => {
    fetchBrands();
    fetchSizes();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">مدیریت برند ناوگان</h1>
          <p className="text-gray-600">افزودن و مدیریت برندهای مختلف ناوگان دریایی</p>
        </div>

        {/* Add Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن برند جدید
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام برند ناوگان
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="مثال: اسکانیا، مرسدس، ایسوزو..."
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

            {/* Sizes Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                سایزهای مرتبط (چند انتخابی)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <label
                    key={size.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedSizes.includes(size.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                      checked={selectedSizes.includes(size.id)}
                      onChange={() => handleSizeToggle(size.id)}
                    />
                    <span className="text-sm font-medium">{size.name}</span>
                  </label>
                ))}
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
                افزودن برند
              </button>
            </div>
          </form>
        </div>

        {/* Brands List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              لیست برندهای ناوگان
            </h2>
            <p className="text-gray-600 mt-1">مدیریت برندهای موجود در سیستم</p>
          </div>

          {brands.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ برندی یافت نشد</h3>
              <p className="text-gray-500">برای شروع، یک برند جدید اضافه کنید</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="p-6 hover:bg-gray-50 transition duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      {brand.logo ? (
                        <img
                          src={`${brand.logo}`}
                          alt={brand.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center border-2 border-gray-200">
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{brand.name}</h3>
                      <p className="text-gray-500">شناسه: {brand.id}</p>
                      {brand.sizes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">سایزهای مرتبط:</p>
                          <div className="flex flex-wrap gap-1">
                            {brand.sizes.map((size) => (
                              <span
                                key={size.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {size.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
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
      {isEditModalOpen && editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ویرایش برند ناوگان
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
              <p className="text-gray-600 mt-1">ویرایش اطلاعات برند: {editingBrand.name}</p>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام برند ناوگان
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="نام جدید برند ناوگان"
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
                {editingBrand.logo && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">لوگوی فعلی:</p>
                    <img
                      src={`${editingBrand.logo}`}
                      alt={editingBrand.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Edit Sizes Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  سایزهای مرتبط (چند انتخابی)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {sizes.map((size) => (
                    <label
                      key={size.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${editSelectedSizes.includes(size.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                        checked={editSelectedSizes.includes(size.id)}
                        onChange={() => handleEditSizeToggle(size.id)}
                      />
                      <span className="text-sm font-medium">{size.name}</span>
                    </label>
                  ))}
                </div>
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
export default NavyBrandDashboard;