import { useState } from "react";
import DashboardLayout from '../layouts/DashboardLayout';

const Commericial_Fleet = () => {
  const [regions, setRegions] = useState([
    { id: 1, province: "تهران", city: "تهران", area: "پاساز خانوم" },
    { id: 2, province: "اصفهان", city: "اصفهان", area: "چهارباغ" },
    { id: 3, province: "شیراز", city: "شیراز", area: "خیابان ولیعصر" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    province: "",
    city: "",
    area: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing region
      setRegions((prev) =>
        prev.map((r) => (r.id === formData.id ? formData : r))
      );
    } else {
      // Add new region
      const newRegion = { ...formData, id: Date.now() };
      setRegions((prev) => [...prev, newRegion]);
    }
    resetForm();
  };

  const handleEdit = (region) => {
    setFormData(region);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const resetForm = () => {
    setFormData({ id: null, province: "", city: "", area: "" });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-500 mb-4">ثبت منطقه فعالیت</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "ویرایش منطقه" : "افزودن منطقه جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="province"
              placeholder="استان"
              value={formData.province}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="شهر"
              value={formData.city}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="text"
              name="area"
              placeholder="منطقه"
              value={formData.area}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {isEditing ? "به‌روزرسانی" : "افزودن"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-lg font-semibold">لیست مناطق فعالیت</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-right">استان</th>
                <th className="px-4 py-2 text-right">شهر</th>
                <th className="px-4 py-2 text-right">منطقه</th>
                <th className="px-4 py-2 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {regions.length > 0 ? (
                regions.map((region) => (
                  <tr key={region.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{region.province}</td>
                    <td className="px-4 py-3">{region.city}</td>
                    <td className="px-4 py-3">{region.area}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(region)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(region.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    هیچ منطقه‌ای ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Commericial_Fleet;