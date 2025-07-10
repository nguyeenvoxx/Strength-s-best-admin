// OrderList.tsx (tương tự Orders.tsx, thêm lọc)
import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const dateMatch = !filterDate || order.date.includes(filterDate);
    const statusMatch = !filterStatus || order.status === filterStatus;
    return dateMatch && statusMatch;
  });

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <div className="mb-4">
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="p-2 border rounded mr-2" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.userName}</td>
              <td className="border p-2">{order.totalAmount}</td>
              <td className="border p-2">
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="p-1 border rounded">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="returned">Returned</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;