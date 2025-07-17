import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import React from 'react';

const ServiceProviderRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  const itemsPerPage = 5;

  const [data, setData] = useState([
    {
      id: 1,
      name: 'علی',
      family: 'احمدی',
      mobile: '09123456789',
      nationalCode: '0011223344',
      activityType: 'حمل و نقل',
      responsibleImage: 'https://picsum.photos/200/300?random=1',
      stampImage: 'https://picsum.photos/200/300?random=2',
      activityArea: 'منطقه ۲ تهران',
      status: 'pending',
    },
    {
      id: 2,
      name: 'رضا',
      family: 'محمدی',
      mobile: '09129876543',
      nationalCode: '1122334455',
      activityType: 'تعمیرگاه',
      responsibleImage: 'https://picsum.photos/200/300?random=3',
      stampImage: 'https://picsum.photos/200/300?random=4',
      activityArea: 'منطقه ۵ تهران',
      status: 'approved',
    },
    {
      id: 3,
      name: 'سارا',
      family: 'حسینی',
      mobile: '09361234567',
      nationalCode: '2233445566',
      activityType: 'فروشگاه',
      responsibleImage: 'https://picsum.photos/200/300?random=5',
      stampImage: 'https://picsum.photos/200/300?random=6',
      activityArea: 'منطقه ۷ تهران',
      status: 'rejected',
    },
    {
      id: 4,
      name: 'نازنین',
      family: 'زارع',
      mobile: '09120001122',
      nationalCode: '3344556677',
      activityType: 'آموزشی',
      responsibleImage: 'https://picsum.photos/200/300?random=7',
      stampImage: 'https://picsum.photos/200/300?random=8',
      activityArea: 'منطقه ۳ تهران',
      status: 'pending',
    },
    {
      id: 5,
      name: 'مصطفی',
      family: 'فرهادی',
      mobile: '09198765432',
      nationalCode: '4455667788',
      activityType: 'سرویس دهنده',
      responsibleImage: 'https://picsum.photos/200/300?random=9',
      stampImage: 'https://picsum.photos/200/300?random=10',
      activityArea: 'منطقه ۴ تهران',
      status: 'pending',
    },
    {
      id: 6,
      name: 'پویا',
      family: 'رضایی',
      mobile: '09121122334',
      nationalCode: '5566778899',
      activityType: 'تعمیر موبایل',
      responsibleImage: 'https://picsum.photos/200/300?random=11',
      stampImage: 'https://picsum.photos/200/300?random=12',
      activityArea: 'منطقه ۶ تهران',
      status: 'approved',
    },
  ]);

  const handleApprove = (id: number) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleReject = (id: number) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const handleImageClick = (imageUrl: React.SetStateAction<string>, altText: React.SetStateAction<string>) => {
    setModalImage(imageUrl);
    setModalAlt(altText);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const changePage = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const handleExpand = (id: number) => {
    if (!expandedRow || expandedRow !== id) {
      setLoadedImages((prev) => ({ ...prev, [id]: true }));
    }
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">درخواست‌های ارائه‌دهندگان خدمات</h1>

        {/* فیلترها */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه</option>
            <option value="pending">در انتظار</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>

        {/* مودال نمایش عکس بزرگ */}
        {modalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div 
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 bg-white rounded-full p-1 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 mr-8">{modalAlt}</h3>
                <img 
                  src={modalImage} 
                  alt={modalAlt}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x300?text=تصویر+یافت+نشد';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* جدول لیست */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-2 text-right">نام</th>
                <th className="px-4 py-2 text-right">نام خانوادگی</th>
                <th className="px-4 py-2 text-right">موبایل</th>
                <th className="px-4 py-2 text-right">رسته فعالیت</th>
                <th className="px-4 py-2 text-right">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    داده‌ای یافت نشد
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      onClick={() => handleExpand(item.id)}
                      className="cursor-pointer hover:bg-gray-50 border-b"
                    >
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.family}</td>
                      <td className="px-4 py-2">{item.mobile}</td>
                      <td className="px-4 py-2">{item.activityType}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.status === 'approved'
                            ? 'تایید شده'
                            : item.status === 'rejected'
                            ? 'رد شده'
                            : 'در انتظار'}
                        </span>
                      </td>
                    </tr>

                    {expandedRow === item.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>کد ملی:</strong> {item.nationalCode}
                            </div>
                            <div>
                              <strong>منطقه فعالیت:</strong> {item.activityArea}
                            </div>
                            <div>
                              <strong>تصویر مسئول:</strong>{' '}
                              {loadedImages[item.id] ? (
                                <img
                                  src={item.responsibleImage.trim()}
                                  alt="مسئول"
                                  className="inline-block w-12 h-12 rounded cursor-pointer hover:opacity-80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(item.responsibleImage.trim(), `تصویر مسئول - ${item.name} ${item.family}`);
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                                  }}
                                />
                              ) : (
                                <span className="text-gray-400">در حال بارگذاری...</span>
                              )}
                            </div>
                            <div>
                              <strong>مهر تصویر:</strong>{' '}
                              {loadedImages[item.id] ? (
                                <img
                                  src={item.stampImage.trim()}
                                  alt="مهر"
                                  className="inline-block w-12 h-12 rounded cursor-pointer hover:opacity-80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(item.stampImage.trim(), `مهر تصویر - ${item.name} ${item.family}`);
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                                  }}
                                />
                              ) : (
                                <span className="text-gray-400">در حال بارگذاری...</span>
                              )}
                            </div>
                            

                            {/* دکمه‌های تایید / رد */}
                            <div className="col-span-full mt-4 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(item.id);
                                }}
                                disabled={item.status === 'approved'}
                                className={`px-4 py-2 rounded-md text-white ${
                                  item.status === 'approved'
                                    ? 'bg-green-300 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                تایید
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(item.id);
                                }}
                                disabled={item.status === 'rejected'}
                                className={`px-4 py-2 rounded-md text-white ${
                                  item.status === 'rejected'
                                    ? 'bg-red-300 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                              >
                                رد
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              قبلی
            </button>

            <div className="flex space-x-2 space-x-reverse">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => changePage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServiceProviderRequests;