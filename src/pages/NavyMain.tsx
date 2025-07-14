import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import { BASE_URL } from "../config";
// Placeholder API URLs (replace with your actual endpoints)
const API_NAVYMAIN = "http://127.0.0.1:8000/api/navymain/";
const API_NAVYTYPES = "http://127.0.0.1:8000/api/navytypes/";
const API_NAVYSIZES_BY_TYPE = "http://127.0.0.1:8000/api/navysizes/by-type/";
const API_NAVYBRANDS_BY_SIZE = "http://127.0.0.1:8000/api/navybrands/by-size/";

// --- Interfaces ---
interface NavyType {
  id: number;
  name: string;
  logo?: string;
}

interface NavySize {
  id: number;
  name: string;
  logo?: string;
  types?: NavyType[];
}

interface NavyBrand {
  id: number;
  name: string;
  logo?: string;
  sizes?: NavySize[];
}

// NavyMain now uses nested objects for type, size, brand
interface NavyMain {
  id: number;
  name: string;
  tip: string;
  type: NavyType | null;
  size: NavySize | null;
  brand: NavyBrand | null;
}

// --- Custom Searchable Select ---
type Option = { value: string; label: string; logo?: string };

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }: SearchableSelectProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = options.filter(opt => opt.label.includes(search));
  const selected = options.find(opt => opt.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full border p-2 rounded text-right bg-white ${disabled ? 'opacity-50' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}
        tabIndex={-1}
        disabled={disabled}
      >
        {selected ? (
          <span className="flex items-center gap-2 rtl:justify-end">
            {selected.logo && <img src={selected.logo} alt="" className="w-5 h-5 rounded" />}
            {selected.label}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder || 'انتخاب کنید'}</span>
        )}
      </button>
      {open && !disabled && (
        <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto rtl right-0">
          <input
            autoFocus
            className="w-full p-2 border-b outline-none rtl text-right"
            placeholder="جستجو..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          {filtered.length === 0 && <div className="p-2 text-gray-400">یافت نشد</div>}
          {filtered.map(opt => (
            <div
              key={opt.value}
              className={`p-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${opt.value === value ? 'bg-blue-100' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); setSearch(""); }}
            >
              {opt.logo && <img src={opt.logo} alt="" className="w-5 h-5 rounded" />}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NavyMainPage = () => {
  // List and pagination
  const [navyMains, setNavyMains] = useState<NavyMain[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const [types, setTypes] = useState<NavyType[]>([]);
  const [sizes, setSizes] = useState<NavySize[]>([]);
  const [brands, setBrands] = useState<NavyBrand[]>([]);

  // Form state
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    tip: "",
    type: "",
    size: "",
    brand: "",
  });
  const [formMode, setFormMode] = useState<'create' | 'edit'>("create");
  const [formErrors, setFormErrors] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);

  // Track if name was manually changed
  const [nameManuallyChanged, setNameManuallyChanged] = useState(false);

  // --- Fetch Functions ---
  const TOKEN = localStorage.getItem('access_token');

  // Fetch NavyMain list (paginated)
  const fetchNavyMains = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_NAVYMAIN}?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("خطا در واکشی لیست ناوگان");
      const data = await response.json();
      // Support both array and paginated object
      if (Array.isArray(data)) {
        setNavyMains(data);
        setTotalPages(1);
      } else {
        setNavyMains(data.results || []);
        setTotalPages(Math.ceil((data.count || 1) / (data.results?.length || 1)));
      }
    } catch (err) {
      setMessage("خطا در دریافت لیست ناوگان");
      setNavyMains([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch NavyTypes for dropdown
  const fetchNavyTypes = async () => {
    try {
      const response = await fetch(API_NAVYTYPES, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("خطا در واکشی انواع");
      const data = await response.json();
      setTypes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setTypes([]);
    }
  };

  // Fetch sizes by type
  const fetchSizesByType = async (typeId: string | number) => {
    if (!typeId) {
      setSizes([]);
      return;
    }
    try {
      const response = await fetch(`${API_NAVYSIZES_BY_TYPE}${typeId}/`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("خطا در واکشی سایزها");
      const data = await response.json();
      setSizes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setSizes([]);
    }
  };

  // Fetch brands by size
  const fetchBrandsBySize = async (sizeId: string | number) => {
    if (!sizeId) {
      setBrands([]);
      return;
    }
    try {
      const response = await fetch(`${API_NAVYBRANDS_BY_SIZE}${sizeId}/`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error("خطا در واکشی برندها");
      const data = await response.json();
      setBrands(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setBrands([]);
    }
  };

  // Fetch on mount and when currentPage changes
  useEffect(() => {
    fetchNavyMains();
    fetchNavyTypes();
  }, [currentPage]);

  // Fetch sizes when type changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, size: "", brand: "" }));
    setBrands([]);
    if (form.type) fetchSizesByType(form.type);
    else setSizes([]);
  }, [form.type]);

  // Fetch brands when size changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, brand: "" }));
    if (form.size) fetchBrandsBySize(form.size);
    else setBrands([]);
  }, [form.size]);

  // Auto-fill name in create mode
  useEffect(() => {
    if (
      formMode === 'create' &&
      !nameManuallyChanged &&
      form.type && form.size && form.brand && form.tip
    ) {
      const typeObj = types.find(t => String(t.id) === form.type);
      const sizeObj = sizes.find(s => String(s.id) === form.size);
      const brandObj = brands.find(b => String(b.id) === form.brand);
      if (typeObj && sizeObj && brandObj) {
        setForm(prev => ({
          ...prev,
          name: `${typeObj.name} - ${sizeObj.name} - ${brandObj.name} - ${form.tip}`
        }));
      }
    }
  }, [form.type, form.size, form.brand, form.tip, formMode, nameManuallyChanged, types, sizes, brands]);

  // Handlers for form fields
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') setNameManuallyChanged(true);
  };

  // Placeholder for form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setMessage(null);
    // Simple validation
    if (!form.name || !form.tip || !form.type || !form.size || !form.brand) {
      setFormErrors({
        name: !form.name ? 'نام الزامی است' : undefined,
        tip: !form.tip ? 'تیپ الزامی است' : undefined,
        type: !form.type ? 'نوع الزامی است' : undefined,
        size: !form.size ? 'سایز الزامی است' : undefined,
        brand: !form.brand ? 'برند الزامی است' : undefined,
      });
      return;
    }
    try {
      const payload = {
        name: form.name,
        tip: form.tip,
        type_id: form.type,
        size_id: form.size,
        brand_id: form.brand,
      };
      let response;
      if (formMode === 'edit' && form.id) {
        response = await fetch(`${API_NAVYMAIN}${form.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API_NAVYMAIN, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        setMessage(errorData?.detail || 'خطا در ثبت اطلاعات');
        return;
      }
      setMessage(formMode === 'edit' ? 'با موفقیت ویرایش شد' : 'با موفقیت افزوده شد');
      setForm({ id: null, name: '', tip: '', type: '', size: '', brand: '' });
      setFormMode('create');
      setSizes([]);
      setBrands([]);
      fetchNavyMains();
      setNameManuallyChanged(false); // Reset after successful submission
    } catch (err) {
      setMessage('خطای غیرمنتظره در ثبت اطلاعات');
    }
  };

  // Edit logic
  const handleEdit = (item: NavyMain) => {
    setForm({
      id: item.id,
      name: item.name || '',
      tip: item.tip || '',
      type: item.type ? String(item.type.id) : '',
      size: item.size ? String(item.size.id) : '',
      brand: item.brand ? String(item.brand.id) : '',
    });
    setFormMode('edit');
    setNameManuallyChanged(false);
    // Fetch dependent dropdowns for edit
    if (item.type) fetchSizesByType(item.type.id);
    if (item.size) fetchBrandsBySize(item.size.id);
  };

  // Delete logic
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این مورد مطمئن هستید؟')) return;
    try {
      const response = await fetch(`${API_NAVYMAIN}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 204) {
        setMessage('با موفقیت حذف شد');
        fetchNavyMains();
      } else {
        setMessage('خطا در حذف');
      }
    } catch (err) {
      setMessage('خطای غیرمنتظره در حذف');
    }
  };

  return (
    <DashboardLayout>
      <div className="rtl text-right max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">مدیریت ناوگان اصلی</h1>
        {message && <div className="mb-4 text-green-600">{message}</div>}
        {/* Compact Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-8 items-end">
          
          <div>
            <label className="block mb-1">نوع</label>
            <SearchableSelect
              options={types.map(t => ({ value: String(t.id), label: t.name, logo: t.logo }))}
              value={form.type}
              onChange={val => setForm(prev => ({ ...prev, type: val }))}
              placeholder="انتخاب نوع"
              disabled={false}
            />
            {formErrors.type && <div className="text-red-600 text-sm">{formErrors.type}</div>}
          </div>
          <div>
            <label className="block mb-1">سایز</label>
            <SearchableSelect
              options={sizes.map(s => ({ value: String(s.id), label: s.name, logo: s.logo ? `${BASE_URL}${s.logo}` : undefined }))}
              value={form.size}
              onChange={val => setForm(prev => ({ ...prev, size: val }))}
              placeholder="انتخاب سایز"
              disabled={!form.type}
            />
            {formErrors.size && <div className="text-red-600 text-sm">{formErrors.size}</div>}
          </div>
          <div>
            <label className="block mb-1">برند</label>
            <SearchableSelect
              options={brands.map(b => ({ value: String(b.id), label: b.name, logo: b.logo ? `${BASE_URL}${b.logo}` : undefined }))}
              value={form.brand}
              onChange={val => setForm(prev => ({ ...prev, brand: val }))}
              placeholder="انتخاب برند"
              disabled={!form.size}
            />
            {formErrors.brand && <div className="text-red-600 text-sm">{formErrors.brand}</div>}
          </div>
          <div>
            <label className="block mb-1">تیپ</label>
            <input
              type="text"
              name="tip"
              value={form.tip}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
              required
            />
            {formErrors.tip && <div className="text-red-600 text-sm">{formErrors.tip}</div>}
          </div>
          <div>
            <label className="block mb-1">نام</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
              required
            />
            {formErrors.name && <div className="text-red-600 text-sm">{formErrors.name}</div>}
          </div>
          
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              {formMode === 'create' ? 'افزودن' : 'ویرایش'}
            </button>
          </div>
        </form>
        {/* List/Table */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">لیست ناوگان</h2>
          {/* Table header */}
          <div className="grid grid-cols-6 gap-2 font-bold border-b pb-2 mb-2">
            <div>نام</div>
            <div>تیپ</div>
            <div>نوع</div>
            <div>سایز</div>
            <div>برند</div>
            <div>عملیات</div>
          </div>
          {/* Table rows */}
          {loading ? (
            <div className="text-center py-4 col-span-6">در حال بارگذاری...</div>
          ) : navyMains.length === 0 ? (
            <div className="text-center py-4 col-span-6">موردی یافت نشد</div>
          ) : navyMains.map((item) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 items-center border-b py-2">
              <div className="flex flex-col items-center justify-center">
                {item.name}
              </div>
              <div className="flex flex-col items-center justify-center">
                {item.tip}
              </div>
              {/* Type: name above logo, centered */}
              <div className="flex flex-col items-center justify-center">
                <span className="mb-1 text-sm font-medium">{item.type?.name}</span>
                {item.type?.logo && (
                  <img src={item.type.logo} alt={item.type.name} className="w-8 h-8 object-cover rounded border" />
                )}
              </div>
              {/* Size: name above logo, centered */}
              <div className="flex flex-col items-center justify-center">
                <span className="mb-1 text-sm font-medium">{item.size?.name}</span>
                {item.size?.logo && (
                  <img src={item.size.logo} alt={item.size.name} className="w-8 h-8 object-cover rounded border" />
                )}
              </div>
              {/* Brand: name above logo, centered */}
              <div className="flex flex-col items-center justify-center">
                <span className="mb-1 text-sm font-medium">{item.brand?.name}</span>
                {item.brand?.logo && (
                  <img src={item.brand.logo} alt={item.brand.name} className="w-8 h-8 object-cover rounded border" />
                )}
              </div>
              {/* Action buttons: icon, color, rounded, hover, tooltip, centered */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                  title="ویرایش"
                  aria-label="ویرایش"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition"
                  title="حذف"
                  aria-label="حذف"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {/* Pagination controls (to be implemented) */}
          <div className="flex justify-center mt-4 gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-2 py-1 border rounded disabled:opacity-50">قبلی</button>
            <span>صفحه {currentPage} از {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-2 py-1 border rounded disabled:opacity-50">بعدی</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NavyMainPage;
