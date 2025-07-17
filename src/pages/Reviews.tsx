import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, deleteReview } from '../services/api'; // Giả sử có hàm deleteReview

interface Review {
  _id: string;
  idProduct: {
    nameProduct: string;
  };
  idUser: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const Reviews: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading, error } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: getReviews,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (err: any) => {
      alert('Lỗi khi xóa đánh giá: ' + (err?.response?.data?.message || err.message));
    }
  });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Đánh giá</h1>
      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi khi tải dữ liệu: {(error as any).message}</p>}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Sản phẩm</th>
                <th className="border p-2 text-left">Người dùng</th>
                <th className="border p-2 text-left">Đánh giá</th>
                <th className="border p-2 text-left">Bình luận</th>
                <th className="border p-2 text-left">Ngày tạo</th>
                <th className="border p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-100">
                  <td className="border p-2">{review.idProduct?.nameProduct || 'N/A'}</td>
                  <td className="border p-2">{review.idUser?.name || 'N/A'}</td>
                  <td className="border p-2">{review.rating} ⭐</td>
                  <td className="border p-2">{review.comment}</td>
                  <td className="border p-2">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteMutation.mutate(review._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
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

export default Reviews;