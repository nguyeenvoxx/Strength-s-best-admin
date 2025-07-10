import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Order {
  _id: string;
  idUser: string;
  totalPrice: number;
  status: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('userId'); // Lấy từ localStorage sau khi đăng nhập

  useEffect(() => {
    if (!currentUserId) {
      setError('Không tìm thấy ID người dùng');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/v1/orders?filter={"idUser":"${currentUserId}"}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.status === 'thành công' && Array.isArray(response.data.data.orders)) {
          setOrders(response.data.data.orders);
        } else {
          setError('Dữ liệu không hợp lệ từ API');
        }
      } catch (err) {
        setError('Lỗi khi lấy danh sách đơn hàng: ' + (err as Error).message);
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, [currentUserId]);

  const handleDeleteOrder = async (_id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await axios.delete(`/api/v1/orders/${_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(orders.filter(o => o._id !== _id));
      } catch (err) {
        setError('Lỗi khi xóa đơn hàng: ' + (err as Error).message);
        console.error('Error deleting order:', err);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        <div>
          <Link to="/order-list" className="text-blue-600 hover:underline mr-4">Xem Danh sách Đơn hàng</Link>
        </div>
      </header>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Đơn hàng</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Tổng giá</th>
                <th className="border p-2 text-left">Trạng thái</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border p-2">{order.totalPrice} VND</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
    </div>
  );
};

export default Orders;