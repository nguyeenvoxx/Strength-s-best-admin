import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  revenueByTime: { label: string; revenue: number }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');
  const [selectedDate, setSelectedDate] = useState('');
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/v1/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: {
            filterType,
            date: selectedDate || undefined
          }
        });
        setStats(response.data.data);
        updateChart(response.data.data.revenueByTime);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, [filterType, selectedDate]);

  const updateChart = (data: { label: string; revenue: number }[]) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Doanh thu (VND)',
            data: data.map(d => d.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Doanh thu (VND)' }
            },
            x: { title: { display: true, text: 'Thời gian' } }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển</h1>
      <div className="mb-4 flex items-center space-x-4">
      
        {/* <input
          type={filterType === 'day' ? 'date' : filterType === 'month' ? 'month' : 'year'}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng số người dùng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng số đơn hàng</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Tổng doanh thu</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats?.totalRevenue || 0} VND</p>
        </div>
      </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'day' | 'month' | 'year')}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
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