import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chart from 'chart.js/auto';
import { getAdminDashboard } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  revenueByTime: { label: string; revenue: number }[];
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển</h1>
      {isLoading && <p>Đang tải...</p>}
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng số người dùng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng số đơn hàng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalOrders ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng doanh thu</h2>
          <p className="text-2xl text-blue-600 mt-2">{formatVND(stats?.totalRevenue ?? 0)}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Biểu đồ Doanh thu</h2>
        <div className="h-64">
          <canvas ref={canvasRef} id="revenueChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;