import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, deleteOrder } from '../services/api'; // Giả sử có hàm deleteOrder
import { Link } from 'react-router-dom';

interface Order {
  _id: string;
  idUser: {
    _id: string;
    name: string;
    email: string;
  };
  totalPrice: number;
  status: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getOrders
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: any) => {
      alert('Lỗi khi xóa đơn hàng: ' + (err?.response?.data?.message || err.message));
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tất cả Đơn hàng</h1>
      </header>
      
      {isLoading && <p>Đang tải đơn hàng...</p>}
      {error && <p className="text-red-500">Lỗi: {(error as any).message}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID Đơn hàng</th>
                <th className="py-2 px-4 border-b">Tên Khách hàng</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Tổng tiền</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Ngày tạo</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.idUser?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.idUser?.email || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.totalPrice.toLocaleString('vi-VN')} VND</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:underline"
                      disabled={deleteMutation.isPending}
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