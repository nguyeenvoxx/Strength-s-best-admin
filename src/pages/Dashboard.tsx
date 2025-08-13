import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'chart.js/auto';
import { getAdminDashboard } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  revenueByTime: { label: string; revenue: number }[];
  latestOrders: Array<{
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
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
    // Lấy số ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
  }
  if (filterType === 'month') {
    return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
  }
  if (filterType === 'year') {
    const now = new Date();
    const currentYear = now.getFullYear();
    return Array.from({ length: 11 }, (_, i) => String(currentYear - 5 + i));
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

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const { data: stats, error, isLoading } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats', filterType, selectedYear, selectedMonth],
    queryFn: () => getAdminDashboard({ filterType, year: selectedYear, month: filterType === 'day' ? selectedMonth : undefined }),
  });

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
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
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
      
      {/* Đơn hàng mới nhất - Di chuyển xuống dưới */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Đơn hàng mới nhất</h2>
        <div className="space-y-3">
          {stats?.latestOrders && stats.latestOrders.length > 0 ? (
            stats.latestOrders.map((order) => (
              <div key={order._id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatVND(order.totalPrice)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;