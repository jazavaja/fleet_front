import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Select from "react-select";

// فرض می‌کنیم فایل‌ها در src/data/ قرار دارند
import provincesData from "../data/provinces.json";
import citiesData from "../data/cities.json";

const Commericial_Fleet = () => {
  // State ها
  const [regions, setRegions] = useState([
    { id: 1, province_id: 100, city_id: 1000001002074, area: "پاساز خانوم" },
    { id: 2, province_id: 101, city_id: 1000004002541, area: "چهارباغ" },
  ]);

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

  // تبدیل استان‌ها به فرمت react-select
  const provinceOptions = provincesData.map(p => ({
    value: p.id,
    label: p.name,
  }));

  // تبدیل شهرهای فیلتر شده به فرمت react-select
  const cityOptions = filteredCities.map(c => ({
    value: c.id,
    label: c.name,
  }));

  // وقتی استان انتخاب شد
  const handleProvinceSelect = (selectedOption) => {
    if (!selectedOption) return;

    const province_id = selectedOption.value;
    const cities = citiesData.filter(c => c.province_id === province_id);

    setFilteredCities(cities);
    setSelectedCityOption(null);

    setFormData(prev => ({
      ...prev,
      province_id,
      city_id: "", // reset city
    }));
    setSelectedProvinceOption(selectedOption);
  };

  // وقتی شهر انتخاب شد
  const handleCitySelect = (selectedOption) => {
    if (!selectedOption) return;

    const city_id = selectedOption.value;
    setFormData(prev => ({
      ...prev,
      city_id,
    }));
    setSelectedCityOption(selectedOption);
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setFormData(prev => ({ ...prev, area }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.province_id || !formData.city_id || !formData.area) {
      alert("لطفا تمام فیلدها را پر کنید");
      return;
    }

    if (isEditing) {
      setRegions((prev) =>
        prev.map((r) => (r.id === formData.id ? formData : r))
      );
    } else {
      const newRegion = { ...formData, id: Date.now() };
      setRegions((prev) => [...prev, newRegion]);
    }
    resetForm();
  };

  const handleEdit = (region) => {
    const provinceOption = provinceOptions.find(p => p.value === region.province_id);
    const cities = citiesData.filter(c => c.province_id === region.province_id);
    const cityOption = cityOptions.find(c => c.value === region.city_id);

    setSelectedProvinceOption(provinceOption);
    setSelectedCityOption(cityOption);
    setFilteredCities(cities);

    setFormData(region);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const resetForm = () => {
    setFormData({ id: null, province_id: "", city_id: "", area: "" });
    setSelectedProvinceOption(null);
    setSelectedCityOption(null);
    setFilteredCities([]);
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
                regions.map((region) => {
                  const provinceName = provincesData.find(p => p.id === region.province_id)?.name || "-";
                  const cityName = citiesData.find(c => c.id === region.city_id)?.name || "-";

                  return (
                    <tr key={region.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{provinceName}</td>
                      <td className="px-4 py-3">{cityName}</td>
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
                  );
                })
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