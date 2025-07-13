import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const NavyTypeDashboard = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);

  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/navytypes/", {
        headers: {
          Authorization: "Token <توکن_شخصی_تو>",
        },
      });
      setTypes(res.data);
    } catch (err) {
      console.error("خطا در دریافت داده‌ها", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);

    try {
      await axios.post("http://127.0.0.1:8000/api/navytypes/", formData, {
        headers: {
          Authorization: "Token <توکن_شخصی_تو>",
        },
      });
      alert("نوع جدید با موفقیت اضافه شد");
      setName("");
      setLogo(null);
      fetchTypes(); // Refresh list
    } catch (err) {
      console.error("خطا در افزودن", err);
      alert("افزودن ناموفق بود");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("حذف شود؟")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/navytypes/${id}/`, {
        headers: {
          Authorization: "Token <توکن_شخصی_تو>",
        },
      });
      fetchTypes(); // Refresh list
    } catch (err) {
      console.error("خطا در حذف", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-700 mb-4">مدیریت نوع ناوگان</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">نام نوع</label>
          <input
            type="text"
            className="mt-1 block w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">لوگو</label>
          <input
            type="file"
            className="mt-1"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          افزودن نوع
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">لیست انواع ناوگان</h2>
      <ul className="space-y-3">
        {types.map((type) => (
          <li
            key={type.id}
            className="p-3 border rounded flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {type.logo && (
                <img
                  src={type.logo}
                  alt={type.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <span className="text-lg">{type.name}</span>
            </div>
            <button
              onClick={() => handleDelete(type.id)}
              className="text-red-600 hover:text-red-800"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
};

export default NavyTypeDashboard;
