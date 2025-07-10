import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Select from "react-select";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const Commercial_Fleet = () => {

  // States
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    province_id: "",
    city_id: "",
    area: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProvinceOption, setSelectedProvinceOption] = useState(null);
  const [selectedCityOption, setSelectedCityOption] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ۱. دریافت لیست استان‌ها
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/regions/provinces/`);
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };
    fetchProvinces();
  }, []);

  // ۲. دریافت شهرها بر اساس استان انتخاب شده
  useEffect(() => {
    if (!selectedProvinceOption) return;

    const fetchCities = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/regions/cities/?province_id=${selectedProvinceOption.value}`
        );
        const data = await res.json();
        setFilteredCities(data);
        setSelectedCityOption(null);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, [selectedProvinceOption]);

  // ۳. دریافت مناطق فعالیت اولیه
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/regions/areas/`);
        const data = await res.json();
        console.log(data)
        setRegions(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activity areas:", err);
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // تبدیل استان‌ها به فرمت react-select
  const provinceOptions = provinces.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const cityOptions = filteredCities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // انتخاب استان
  const handleProvinceSelect = (selectedOption) => {
    setSelectedProvinceOption(selectedOption);
    setFormData((prev) => ({
      ...prev,
      province_id: selectedOption?.value || "",
      city_id: "",
    }));
    setSelectedCityOption(null);
  };

  // انتخاب شهر
  const handleCitySelect = (selectedOption) => {
    setSelectedCityOption(selectedOption);
    setFormData((prev) => ({
      ...prev,
      city_id: selectedOption?.value || "",
    }));
  };

  // تغییر منطقه
  const handleAreaChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      area: e.target.value,
    }));
  };

  // ثبت منطقه
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.province_id || !formData.city_id || !formData.area) {
      alert("لطفا تمام فیلدها را پر کنید");
      return;
    }
    const payload = {
      city_id: formData.city_id,
      area: formData.area,
    };

    try {
      if (isEditing) {
        // ویرایش
        const res = await fetch(`${API_BASE_URL}/regions/areas/${formData.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update");

        const updatedData = await res.json();
        setRegions((prev) =>
          prev.map((r) => (r.id === formData.id ? updatedData : r))
        );
      } else {
        // ثبت جدید

        console.log(JSON.stringify(payload))
        const res = await fetch(`${API_BASE_URL}/regions/areas/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create");

        const newData = await res.json();
        setRegions((prev) => [...prev, newData]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره اطلاعات");
    }
  };

  // ویرایش منطقه
  const handleEdit = (region) => {
    console.log(region)
    const provinceOption = provinceOptions.find(
      (p) => p.value === region.city.province.id
    );
    const cityOption = cityOptions.find((c) => c.value === region.city.id);

    setSelectedProvinceOption(provinceOption);
    setSelectedCityOption(cityOption);
    setFilteredCities([region.city]);

    setFormData({
      id: region.id,
      province_id: region.city.province.id,
      city_id: region.city.id,
      area: region.area,
    });
    setIsEditing(true);
  };

  // حذف منطقه
  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/regions/areas/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setRegions((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("خطا در حذف منطقه");
    }
  };

  // ریست فرم
  const resetForm = () => {
    setFormData({ id: null, province_id: "", city_id: "", area: "" });
    setSelectedProvinceOption(null);
    setSelectedCityOption(null);
    setFilteredCities([]);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      {/* فرم */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "ویرایش منطقه" : "افزودن منطقه جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* استان */}
            <div>
              <label className="block text-sm font-medium mb-1">استان</label>
              <Select
                options={provinceOptions}
                value={selectedProvinceOption}
                onChange={handleProvinceSelect}
                placeholder="انتخاب استان"
                isSearchable
              />
            </div>

            {/* شهر */}
            <div>
              <label className="block text-sm font-medium mb-1">شهر</label>
              <Select
                options={cityOptions}
                value={selectedCityOption}
                onChange={handleCitySelect}
                placeholder="ابتدا استان را انتخاب کنید"
                isSearchable
                isDisabled={!selectedProvinceOption}
              />
            </div>

            {/* منطقه */}
            <div>
              <label className="block text-sm font-medium mb-1">منطقه</label>
              <input
                type="text"
                name="area"
                placeholder="منطقه"
                value={formData.area}
                onChange={handleAreaChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                required
              />
            </div>
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

      {/* لیست مناطق */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-lg font-semibold">لیست مناطق فعالیت</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">در حال بارگزاری...</div>
          ) : regions.length > 0 ? (
            <table className="w-full table-auto">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  
                  <th className="px-4 py-2 text-right">شهر</th>
                  <th className="px-4 py-2 text-right">منطقه</th>
                  <th className="px-4 py-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <tr key={region.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{region.city.name}</td>
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
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">هیچ منطقه‌ای ثبت نشده است.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Commercial_Fleet;