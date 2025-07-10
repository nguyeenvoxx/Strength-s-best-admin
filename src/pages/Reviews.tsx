import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Review {
  _id: string;
  idProduct: string;
  idUser: string;
  rating: number;
  comment: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('userId'); // Lấy từ localStorage sau khi đăng nhập

  useEffect(() => {
    if (!currentUserId) {
      setError('Không tìm thấy ID người dùng');
      return;
    }
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/v1/reviews?filter={"idUser":"${currentUserId}"}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.status === 'thành công' && Array.isArray(response.data.data.reviews)) {
          setReviews(response.data.data.reviews);
        } else {
          setError('Dữ liệu không hợp lệ từ API');
        }
      } catch (err) {
        setError('Lỗi khi lấy danh sách đánh giá: ' + (err as Error).message);
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [currentUserId]);

  const handleDeleteReview = async (_id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await axios.delete(`/api/v1/reviews/${_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReviews(reviews.filter(r => r._id !== _id));
      } catch (err) {
        setError('Lỗi khi xóa đánh giá: ' + (err as Error).message);
        console.error('Error deleting review:', err);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Đánh giá của tôi</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Đánh giá</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product ID</th>
                <th className="border p-2 text-left">Rating</th>
                <th className="border p-2 text-left">Comment</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-100">
                  <td className="border p-2">{review.idProduct}</td>
                  <td className="border p-2">{review.rating}</td>
                  <td className="border p-2">{review.comment}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
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

export default Reviews;