import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Chart from 'chart.js/auto';
import { getAdminDashboard, getPendingOrders, updateOrderStatus } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  revenueByTime: { label: string; revenue: number }[];
  pendingOrders: Array<{
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  totalPendingOrders: number;
  topSellingProducts: Array<{
    _id: string;
    productName: string;
    productImage: string;
    totalSold: number;
    totalRevenue: number;
  }>;
}

const formatDateLabel = (label: string, filterType: string) => {
  if (!label) return '';
  if (filterType === 'day') {
    // label là yyyy-MM-dd hoặc ISO, chuyển sang dd/MM/yyyy
    const d = new Date(label);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('vi-VN');
    }
    return label;
  }
  if (filterType === 'month') {
    // label là yyyy-MM, chuyển sang MM/yyyy
    const [year, month] = label.split('-');
    if (year && month) return `${month}/${year}`;
    return label;
  }
  if (filterType === 'year') {
    return label;
  }
  return label;
};

const formatVND = (value: number) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm sinh mốc thời gian đầy đủ
function getFullTimeLabels(filterType: string, year: number, month: number) {
  if (filterType === 'day') {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();
    
    // Lấy số ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Nếu đang xem tháng hiện tại của năm hiện tại, chỉ hiển thị đến ngày hiện tại
    if (year === currentYear && month === currentMonth) {
      return Array.from({ length: currentDay }, (_, i) => `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
    }
    // Nếu xem tháng khác, hiển thị tất cả ngày trong tháng
    return Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
  }
  if (filterType === 'month') {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    // Nếu đang xem năm hiện tại, chỉ hiển thị đến tháng hiện tại
    if (year === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
    }
    // Nếu xem năm khác, hiển thị tất cả 12 tháng
    return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
  }
  if (filterType === 'year') {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Chỉ hiển thị từ năm 2020 đến năm hiện tại
    const startYear = Math.max(2020, currentYear - 5);
    const yearsCount = currentYear - startYear + 1;
    return Array.from({ length: yearsCount }, (_, i) => String(startYear + i));
  }
  return [];
}

const Dashboard: React.FC = () => {
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
  const [pendingOrdersPage, setPendingOrdersPage] = useState(1);
  const [showAllPendingOrders, setShowAllPendingOrders] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'pending' | 'processing' | 'shipped' | 'all'>('all');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    orderId: string;
    newStatus: string;
    currentStatus: string;
  }>({
    isOpen: false,
    orderId: '',
    newStatus: '',
    currentStatus: ''
  });

  // Chỉ hiển thị từ năm 2020 đến năm hiện tại
  const startYear = Math.max(2020, currentYear - 5);
  const yearsCount = currentYear - startYear + 1;
  const years = Array.from({ length: yearsCount }, (_, i) => startYear + i);
  // Nếu đang ở năm hiện tại, chỉ hiển thị đến tháng hiện tại
  const currentMonth = now.getMonth() + 1;
  const months = selectedYear === currentYear 
    ? Array.from({ length: currentMonth }, (_, i) => i + 1)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  const { data: stats, error, isLoading } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats', filterType, selectedYear, selectedMonth],
    queryFn: () => getAdminDashboard({ filterType, year: selectedYear, month: filterType === 'day' ? selectedMonth : undefined }),
  });

  const queryClient = useQueryClient();

  const { data: pendingOrdersData, isLoading: pendingOrdersLoading } = useQuery({
    queryKey: ['pendingOrders', pendingOrdersPage, selectedStatusFilter],
    queryFn: () => getPendingOrders(pendingOrdersPage, 10, selectedStatusFilter),
    enabled: showAllPendingOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
      updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      // Optimistic update
      queryClient.setQueryData(['pendingOrders', pendingOrdersPage, selectedStatusFilter], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pendingOrders: oldData.pendingOrders.map((order: any) =>
            order._id === variables.orderId 
              ? { ...order, status: variables.status }
              : order
          )
        };
      });
      
      // Invalidate queries after a delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['pendingOrders'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      }, 1000);
    }
  });

  // Cập nhật selectedMonth khi selectedYear thay đổi
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Nếu chuyển sang năm hiện tại và selectedMonth lớn hơn tháng hiện tại
    if (selectedYear === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    }
  }, [selectedYear, selectedMonth]);

  // Reset page khi đóng modal đơn hàng chưa được xử lý
  useEffect(() => {
    if (!showAllPendingOrders) {
      setPendingOrdersPage(1);
    }
  }, [showAllPendingOrders]);

  useEffect(() => {
    if (stats?.revenueByTime) {
      // Merge dữ liệu backend vào mốc thời gian chuẩn
      const fullLabels = getFullTimeLabels(filterType, selectedYear, selectedMonth);
      const dataMap = new Map(stats.revenueByTime.map(d => [d.label, d.revenue]));
      const mergedData = fullLabels.map(label => ({ label, revenue: dataMap.get(label) ?? 0 }));
      updateChart(mergedData, filterType);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, filterType, selectedYear, selectedMonth]);

  const updateChart = (data: { label: string; revenue: number }[], filterType: string) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    // Tính stepSize động dựa trên max doanh thu
    let maxRevenue = 0;
    data.forEach(d => {
      if (typeof d.revenue === 'number' && d.revenue > maxRevenue) maxRevenue = d.revenue;
    });
    let stepSize = 1000000; // 1 triệu
    if (maxRevenue < 10000000) stepSize = 1000000;
    else if (maxRevenue < 100000000) stepSize = 5000000;
    else if (maxRevenue < 1000000000) stepSize = 10000000;
    else stepSize = 100000000;
    if (maxRevenue === 0) stepSize = 1000000;

    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: data.map(d => formatDateLabel(d.label, filterType)),
          datasets: [{
            label: 'Doanh thu (VND)',
            data: data.map(d => d.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              ticks: {
                stepSize,
                callback: function(value) {
                  let num: number = 0;
                  if (typeof value === 'number') {
                    num = value;
                  } else if (typeof value === 'string') {
                    const parsed = parseFloat(value);
                    num = isNaN(parsed) ? 0 : parsed;
                  }
                  return formatVND(num);
                }
              },
              title: { display: true, text: 'Doanh thu (VND)' },
            },
            x: {
              title: { display: true, text: filterType === 'day' ? 'Ngày' : filterType === 'month' ? 'Tháng/Năm' : 'Năm' },
              ticks: {
                autoSkip: false,
                callback: function(value, index, values) {
                  // Hiển thị nhãn đúng, không lặp, không trống
                  if (this.getLabelForValue) {
                    return this.getLabelForValue(Number(value));
                  }
                  return value;
                }
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return formatVND(context.parsed.y);
                }
              }
            }
          }
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const getNextStatusText = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    return getStatusText(nextStatus);
  };

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus === currentStatus) return;

    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus: nextStatus,
      currentStatus
    });
  };

  const confirmStatusUpdate = () => {
    if (confirmModal.isOpen) {
      updateStatusMutation.mutate({
        orderId: confirmModal.orderId,
        status: confirmModal.newStatus
      });
      setConfirmModal({ isOpen: false, orderId: '', newStatus: '', currentStatus: '' });
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Không xác định';
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển quản trị</h1>
      {isLoading && <p>Đang tải dữ liệu...</p>}
      {error && <div className="text-red-500 mb-4">Lỗi: {error.message}</div>}
      {/* Bộ lọc thời gian */}
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'day' | 'month' | 'year')}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
        {(filterType === 'day' || filterType === 'month') && (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {filterType === 'day' && (
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {months.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
          </select>
        )}
        {filterType === 'year' && (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
      </div>
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng người dùng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng đơn hàng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalOrders ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng doanh thu</h2>
          <p className="text-2xl text-blue-600 mt-2">{formatVND(stats?.totalRevenue ?? 0)}</p>
        </div>
      </div>
      {/* Biểu đồ doanh thu - To hơn */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Biểu đồ doanh thu</h2>
        <div className="h-96">
          <canvas ref={canvasRef} id="revenueChart"></canvas>
        </div>
      </div>
      {/* Sản phẩm bán chạy */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Top sản phẩm bán chạy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
            stats.topSellingProducts.map((product, index) => (
              <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="relative mb-3">
                    <img
                      src={product.productImage ? `http://localhost:3000/uploads/products/${product.productImage}` : '/assets/default-product.png'}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/default-product.png';
                      }}
                    />
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{product.productName}</h3>
                  <p className="text-green-600 font-semibold text-sm">{formatVND(product.totalRevenue)}</p>
                  <p className="text-gray-500 text-xs">Đã bán: {product.totalSold}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4 col-span-full">Chưa có dữ liệu sản phẩm bán chạy</p>
          )}
        </div>
      </div>
      
      {/* Đơn hàng chưa được xử lý */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Đơn hàng đang xử lý
            <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
              {stats?.totalPendingOrders || 0}
            </span>
          </h2>
          {stats?.totalPendingOrders && stats.totalPendingOrders > 5 && (
            <button
              onClick={() => setShowAllPendingOrders(!showAllPendingOrders)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAllPendingOrders ? 'Thu gọn' : 'Xem tất cả'}
            </button>
          )}
        </div>

        {/* Filter buttons */}
        {showAllPendingOrders && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1 text-sm rounded border ${
                selectedStatusFilter === 'all'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedStatusFilter('pending')}
              className={`px-3 py-1 text-sm rounded border ${
                selectedStatusFilter === 'pending'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Chờ xử lý
            </button>
            <button
              onClick={() => setSelectedStatusFilter('processing')}
              className={`px-3 py-1 text-sm rounded border ${
                selectedStatusFilter === 'processing'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Đang xử lý
            </button>
            <button
              onClick={() => setSelectedStatusFilter('shipped')}
              className={`px-3 py-1 text-sm rounded border ${
                selectedStatusFilter === 'shipped'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Đang giao
            </button>
          </div>
        )}
        
        <div className="space-y-3">
          {showAllPendingOrders ? (
            // Hiển thị tất cả đơn hàng chưa được xử lý với phân trang
            <>
              {pendingOrdersLoading ? (
                <p className="text-gray-500 text-center py-4">Đang tải...</p>
              ) : pendingOrdersData?.pendingOrders && pendingOrdersData.pendingOrders.length > 0 ? (
                <>
                  {pendingOrdersData.pendingOrders.map((order: any) => (
                    <div key={order._id} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-sm text-gray-600">{order.user.email}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-semibold text-green-600">{formatVND(order.totalPrice)}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, order.status)}
                                disabled={updateStatusMutation.isPending}
                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updateStatusMutation.isPending ? 'Đang cập nhật...' : `→ ${getNextStatusText(order.status)}`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Phân trang */}
                  {pendingOrdersData.totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      <button 
                        onClick={() => setPendingOrdersPage(p => Math.max(1, p - 1))} 
                        disabled={pendingOrdersPage === 1}
                        className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
                      >
                        &laquo;
                      </button>
                      
                      {/* Logic phân trang gọn */}
                      {(() => {
                        const pages = [];
                        const maxVisiblePages = 3; // Giảm xuống 3 để gọn hơn
                        let startPage = Math.max(1, pendingOrdersPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(pendingOrdersData.totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        // Thêm trang đầu nếu cần
                        if (startPage > 1) {
                          pages.push(
                            <button 
                              key={1} 
                              onClick={() => setPendingOrdersPage(1)} 
                              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
                            >
                              1
                            </button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="dots1" className="px-2 py-1 text-gray-500">...</span>
                            );
                          }
                        }

                        // Thêm các trang hiển thị
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button 
                              key={i}
                              onClick={() => setPendingOrdersPage(i)}
                              className={`px-3 py-1 rounded border ${
                                i === pendingOrdersPage 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Thêm trang cuối nếu cần
                        if (endPage < pendingOrdersData.totalPages) {
                          if (endPage < pendingOrdersData.totalPages - 1) {
                            pages.push(
                              <span key="dots2" className="px-2 py-1 text-gray-500">...</span>
                            );
                          }
                          
                          pages.push(
                            <button 
                              key={pendingOrdersData.totalPages} 
                              onClick={() => setPendingOrdersPage(pendingOrdersData.totalPages)} 
                              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
                            >
                              {pendingOrdersData.totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}
                      
                      <button 
                        onClick={() => setPendingOrdersPage(p => Math.min(pendingOrdersData.totalPages, p + 1))} 
                        disabled={pendingOrdersPage === pendingOrdersData.totalPages}
                        className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
                      >
                        &raquo;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">Không có đơn hàng chưa được xử lý</p>
              )}
            </>
          ) : (
            // Hiển thị 5 đơn hàng chưa được xử lý gần nhất
            <>
              {stats?.pendingOrders && stats.pendingOrders.length > 0 ? (
                stats.pendingOrders.map((order) => (
                  <div key={order._id} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="font-semibold text-green-600">{formatVND(order.totalPrice)}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, order.status)}
                              disabled={updateStatusMutation.isPending}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updateStatusMutation.isPending ? 'Đang cập nhật...' : `→ ${getNextStatusText(order.status)}`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Không có đơn hàng đang xử lý</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Xác nhận cập nhật trạng thái"
        message={`Bạn có chắc chắn muốn chuyển đơn hàng từ "${getStatusText(confirmModal.currentStatus)}" sang "${getStatusText(confirmModal.newStatus)}"?`}
        onConfirm={confirmStatusUpdate}
        onCancel={() => setConfirmModal({ isOpen: false, orderId: '', newStatus: '', currentStatus: '' })}
        confirmText="Cập nhật"
        cancelText="Hủy"
        type="warning"
      />
    </div>
  );
};

export default Dashboard;