import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, deleteOrder, getOrderDetail } from '../services/api'; // Giả sử có hàm deleteOrder
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
  created_at?: string;
}

interface OrderDetail {
  _id: string;
  idProduct: { _id: string; nameProduct: string; priceProduct: number };
  price: number;
  name: string;
  quantity: number;
}
interface Payment {
  _id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [orderDetail, setOrderDetail] = React.useState<any>(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);
  const [errorDetail, setErrorDetail] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => getOrders(page, 10),
  });
  const orders = data?.data?.orders || data?.orders || [];
  React.useEffect(() => {
    if (data?.results) {
      setTotalPages(Math.ceil(data.results / 10));
    }
  }, [data]);

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

  const handleShowDetail = async (id: string) => {
    setSelectedOrderId(id);
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const detail = await getOrderDetail(id);
      setOrderDetail(detail);
    } catch (err: any) {
      setErrorDetail('Lỗi khi tải chi tiết đơn hàng');
      setOrderDetail(null);
    }
    setLoadingDetail(false);
  };
  const handleCloseDetail = () => {
    setSelectedOrderId(null);
    setOrderDetail(null);
    setErrorDetail(null);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
      </header>
      
      {isLoading && <p>Đang tải đơn hàng...</p>}
      {error && <p className="text-red-500">Lỗi: {(error as any).message}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                <th className="py-2 px-4 border-b">Khách hàng</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Tổng tiền</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Ngày mua</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.idUser?.name || 'Không có'}</td>
                  <td className="py-2 px-4 border-b">{order.idUser?.email || 'Không có'}</td>
                  <td className="py-2 px-4 border-b">{order.totalPrice.toLocaleString('vi-VN')} ₫</td>
                  <td className="py-2 px-4 border-b">{order.status === 'pending' ? 'Chờ xử lý' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'completed' ? 'Hoàn thành' : order.status === 'returned' ? 'Đã hoàn trả' : order.status}</td>
                  <td className="py-2 px-4 border-b">{
  (order.created_at && !isNaN(Date.parse(order.created_at)))
    ? new Date(order.created_at).toLocaleDateString('vi-VN')
    : (order.createdAt && !isNaN(Date.parse(order.createdAt)))
      ? new Date(order.createdAt).toLocaleDateString('vi-VN')
      : 'Không xác định'
}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleShowDetail(order._id)}
                      className="text-blue-600 hover:underline mr-2"
                    >Xem chi tiết</button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:underline"
                      disabled={deleteMutation.isPending}
                    >Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&laquo;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&raquo;</button>
        </div>
      </div>
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={handleCloseDetail} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
            <h2 className="text-xl font-bold mb-2">Chi tiết đơn hàng</h2>
            {loadingDetail ? <p>Đang tải chi tiết...</p> : errorDetail ? <p className="text-red-500">{errorDetail}</p> : orderDetail && (
              <div>
                <div className="mb-2"><b>Mã đơn hàng:</b> {orderDetail.order._id}</div>
                <div className="mb-2"><b>Khách hàng:</b> {orderDetail.order.idUser?.name} ({orderDetail.order.idUser?.email})</div>
                <div className="mb-2"><b>Ngày mua:</b> {new Date(orderDetail.order.created_at || orderDetail.order.createdAt).toLocaleString('vi-VN')}</div>
                <div className="mb-2"><b>Trạng thái:</b> {orderDetail.order.status === 'pending' ? 'Chờ xử lý' : orderDetail.order.status === 'processing' ? 'Đang xử lý' : orderDetail.order.status === 'completed' ? 'Hoàn thành' : orderDetail.order.status === 'returned' ? 'Đã hoàn trả' : orderDetail.order.status}</div>
                <div className="mb-2"><b>Tổng tiền:</b> {orderDetail.order.totalPrice.toLocaleString('vi-VN')} ₫</div>
                <div className="mb-2"><b>Thanh toán:</b> {orderDetail.payment ? `${orderDetail.payment.amount.toLocaleString('vi-VN')} ₫ - ${orderDetail.payment.method === 'credit_card' ? 'Thẻ tín dụng' : orderDetail.payment.method === 'cash_on_delivery' ? 'Thanh toán khi nhận hàng' : orderDetail.payment.method === 'bank_transfer' ? 'Chuyển khoản' : orderDetail.payment.method === 'paypal' ? 'PayPal' : orderDetail.payment.method} - ${orderDetail.payment.status === 'pending' ? 'Chờ xử lý' : orderDetail.payment.status === 'completed' ? 'Đã thanh toán' : 'Thất bại'}` : 'Chưa thanh toán'}</div>
                <div className="mb-2"><b>Sản phẩm đã mua:</b></div>
                <table className="w-full border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 border">Tên sản phẩm</th>
                      <th className="p-1 border">Giá</th>
                      <th className="p-1 border">Số lượng</th>
                      <th className="p-1 border">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.orderDetails.map((item: OrderDetail) => (
                      <tr key={item._id}>
                        <td className="p-1 border">{item.idProduct?.nameProduct || item.name}</td>
                        <td className="p-1 border">{item.price.toLocaleString('vi-VN')} ₫</td>
                        <td className="p-1 border">{item.quantity}</td>
                        <td className="p-1 border">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;