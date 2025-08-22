import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderDetail, updateOrderStatus } from '../services/api'; // Giả sử có hàm deleteOrder
import { Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

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

// Helper functions
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'processing': return 'Đang xử lý';
    case 'shipped': return 'Đang giao';
    case 'delivered': return 'Đã giao';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const getPaymentStatusColor = (status?: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusText = (payment: any) => {
  if (!payment) return 'Chưa thanh toán';
  switch (payment.status) {
    case 'completed': return 'Đã thanh toán';
    case 'pending': return 'Chờ thanh toán';
    case 'failed': return 'Thanh toán thất bại';
    default: return 'Chưa thanh toán';
  }
};

const getPaymentMethodText = (method?: string) => {
  if (!method) return 'Chưa chọn';
  
  const normalizedMethod = method.toLowerCase().trim();
  
  switch (normalizedMethod) {
    case 'credit_card':
    case 'card':
    case 'visa':
    case 'mastercard':
    case 'amex':
    case 'jcb':
    case 'unionpay':
      return 'Thẻ tín dụng';
    case 'cash_on_delivery':
    case 'cod':
      return 'Thanh toán khi nhận hàng (COD)';
    case 'bank_transfer':
      return 'Chuyển khoản';
    case 'paypal':
      return 'PayPal';
    case 'momo':
      return 'Ví MoMo';
    case 'vnpay':
      return 'VNPay';
    case 'zalopay':
      return 'ZaloPay';
    case 'shopee_pay':
      return 'ShopeePay';
    case 'grab_pay':
      return 'GrabPay';
    case 'stripe':
      return 'Stripe';
    case 'apple_pay':
      return 'Apple Pay';
    case 'google_pay':
      return 'Google Pay';
    case 'samsung_pay':
      return 'Samsung Pay';
    case 'unknown':
      return 'Chưa chọn';
    default:
      // Nếu là một method khác, hiển thị method đó
      return method;
  }
};

const Orders: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [orderDetail, setOrderDetail] = React.useState<any>(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);
  const [errorDetail, setErrorDetail] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [pendingStatusChange, setPendingStatusChange] = React.useState<{id: string, status: string} | null>(null);

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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      // Cập nhật ngay lập tức thay vì invalidate toàn bộ
      queryClient.setQueryData(['orders', page], (oldData: any) => {
        if (!oldData) return oldData;
        
        const updatedOrders = oldData.data?.orders?.map((order: any) => {
          if (order._id === variables.id) {
            return {
              ...order,
              status: variables.status,
              updated_at: new Date().toISOString()
            };
          }
          return order;
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            orders: updatedOrders
          }
        };
      });

      // Hiển thị thông báo thành công
      const statusText = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      
      alert(`Cập nhật trạng thái đơn hàng thành công: ${statusText[variables.status as keyof typeof statusText]}`);
      
      // Refresh sau 1 giây để đồng bộ với server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }, 1000);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng';
      alert(errorMessage);
    },
  });

  const handleShowDetail = async (id: string) => {
    setSelectedOrderId(id);
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const detail = await getOrderDetail(id);
      console.log('🔍 Order Detail Payment Info:', {
        paymentMethod: detail.payment?.method,
        orderPaymentMethod: detail.order?.paymentMethod,
        paymentPaymentMethod: detail.payment?.paymentMethod,
        payment: detail.payment,
        order: detail.order
      });
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

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

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
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={e => {
                        const newStatus = e.target.value;
                        const oldStatus = order.status;
                        if (newStatus !== oldStatus) {
                          setPendingStatusChange({ id: order._id, status: newStatus });
                          setShowConfirmModal(true);
                          // Reset về giá trị cũ tạm thời
                          e.target.value = oldStatus;
                        }
                      }}
                      className={`p-1 border rounded ${(order.status === 'delivered' || order.status === 'cancelled') ? 'bg-gray-100 text-gray-500' : ''}`}
                      disabled={updateStatusMutation.isPending || order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <div className="text-xs text-gray-500 mt-1">
                        {order.status === 'delivered' ? 'Không thể thay đổi trạng thái đơn hàng đã giao' : 'Không thể thay đổi trạng thái đơn hàng đã hủy'}
                      </div>
                    )}
                  </td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&laquo;</button>
          
          {/* Logic phân trang gọn */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 3;
            let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Thêm trang đầu nếu cần
            if (startPage > 1) {
              pages.push(
                <button 
                  key={1} 
                  onClick={() => setPage(1)} 
                  className="px-3 py-1 rounded border bg-gray-100"
                >
                  1
                </button>
              );
              
              if (startPage > 2) {
                pages.push(
                  <span key="dots1" className="px-2 py-1">...</span>
                );
              }
            }

            // Thêm các trang hiển thị
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button 
                  key={i} 
                  onClick={() => setPage(i)} 
                  className={`px-3 py-1 rounded border ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  {i}
                </button>
              );
            }

            // Thêm trang cuối nếu cần
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(
                  <span key="dots2" className="px-2 py-1">...</span>
                );
              }
              
              pages.push(
                <button 
                  key={totalPages} 
                  onClick={() => setPage(totalPages)} 
                  className="px-3 py-1 rounded border bg-gray-100"
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}
          
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&raquo;</button>
        </div>
      </div>
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                <button 
                  onClick={handleCloseDetail} 
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingDetail ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                </div>
              ) : errorDetail ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-lg mb-2">⚠️</div>
                  <p className="text-red-500">{errorDetail}</p>
                </div>
              ) : orderDetail && (
                <div className="space-y-6">
                  {/* Thông tin đơn hàng */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Thông tin đơn hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Mã đơn hàng:</span>
                          <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                            {orderDetail.order._id}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Ngày đặt:</span>
                          <span className="text-gray-800">
                            {new Date(orderDetail.order.created_at || orderDetail.order.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Trạng thái:</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(orderDetail.order.status)}`}>
                            {getStatusText(orderDetail.order.status)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Tổng tiền:</span>
                          <span className="text-gray-800 font-semibold text-lg">
                            {orderDetail.order.totalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Số sản phẩm:</span>
                          <span className="text-gray-800">
                            {orderDetail.orderDetails.length} sản phẩm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Thông tin khách hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Tên:</span>
                          <span className="text-gray-800 font-medium">{orderDetail.order.idUser?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Email:</span>
                          <span className="text-gray-800">{orderDetail.order.idUser?.email}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-24">Số điện thoại:</span>
                          <span className="text-gray-800">
                            {orderDetail.order.shippingAddress?.phone || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán */}
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Thông tin thanh toán
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium w-24">Trạng thái:</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(orderDetail.payment?.status)}`}>
                              {getPaymentStatusText(orderDetail.payment)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium w-24">Phương thức:</span>
                            <span className="text-gray-800 font-medium">
                              {getPaymentMethodText(
                                orderDetail.payment?.method || 
                                orderDetail.order?.paymentMethod || 
                                orderDetail.payment?.paymentMethod ||
                                'unknown'
                              )}
                            </span>
                          </div>
                          {orderDetail.payment?.amount && (
                            <div className="flex items-center">
                              <span className="text-gray-600 font-medium w-24">Số tiền:</span>
                              <span className="text-gray-800 font-semibold">
                                {orderDetail.payment.amount.toLocaleString('vi-VN')} ₫
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {orderDetail.payment?.transactionId && (
                            <div className="flex items-center">
                              <span className="text-gray-600 font-medium w-24">Mã giao dịch:</span>
                              <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                                {orderDetail.payment.transactionId}
                              </span>
                            </div>
                          )}
                          {orderDetail.payment?.paidAt && (
                            <div className="flex items-center">
                              <span className="text-gray-600 font-medium w-24">Ngày thanh toán:</span>
                              <span className="text-gray-800">
                                {new Date(orderDetail.payment.paidAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          )}
                          {orderDetail.payment?.gatewayResponse && (
                            <div className="flex items-center">
                              <span className="text-gray-600 font-medium w-24">Gateway:</span>
                              <span className="text-gray-800">
                                {orderDetail.payment.gatewayResponse.gateway || 'N/A'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Địa chỉ giao hàng */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                      Địa chỉ giao hàng
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-pink-200">
                      {orderDetail.order.shippingAddress ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium w-20">Người nhận:</span>
                            <span className="text-gray-800 font-medium">
                              {orderDetail.order.shippingAddress.name || 
                               orderDetail.order.idUser?.name || 
                               orderDetail.order.customerName || 
                               'Khách hàng'}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-20">Địa chỉ:</span>
                            <span className="text-gray-800 flex-1">{orderDetail.order.shippingAddress.address || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Chưa có thông tin địa chỉ giao hàng</p>
                      )}
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Danh sách sản phẩm ({orderDetail.orderDetails.length} sản phẩm)
                    </h3>
                    <div className="space-y-3">
                      {orderDetail.orderDetails.map((item: OrderDetail, index: number) => (
                        <div key={item._id} className="bg-white rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {(item.idProduct as any)?.image ? (
                                <img 
                                  src={`http://localhost:3000/uploads/products/${(item.idProduct as any).image}`}
                                  alt={(item.idProduct as any)?.nameProduct || 'Sản phẩm'}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                  onError={(e: any) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                      (e.target.nextSibling as HTMLElement).style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs" style={{ display: (item.idProduct as any)?.image ? 'none' : 'flex' }}>
                                {(item.idProduct as any)?.image ? '' : (index + 1)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-800 font-medium truncate">
                                {item.idProduct?.nameProduct || item.name}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                <span>Giá: {item.price.toLocaleString('vi-VN')} ₫</span>
                                <span>•</span>
                                <span>Số lượng: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận thay đổi trạng thái"
        message={pendingStatusChange ? 
          `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ "${statusOptions.find(s => s.value === orders.find((o: Order) => o._id === pendingStatusChange.id)?.status)?.label}" sang "${statusOptions.find(s => s.value === pendingStatusChange.status)?.label}" không?` : 
          ''
        }
        onConfirm={() => {
          if (pendingStatusChange) {
            updateStatusMutation.mutate(pendingStatusChange);
          }
          setShowConfirmModal(false);
          setPendingStatusChange(null);
        }}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingStatusChange(null);
        }}
        type="warning"
      />
    </div>
  );
};

export default Orders;