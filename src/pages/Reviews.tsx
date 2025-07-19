import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, deleteReview, addAdminReply, editAdminReply, deleteAdminReply } from '../services/api'; // Giả sử có hàm deleteReview

interface AdminReply {
  content: string;
  createdAt: string;
  updatedAt: string;
  admin: { name: string } | string;
}
interface Review {
  _id: string;
  idProduct: {
    nameProduct: string;
  };
  idUser: {
    name: string;
  };
  rating: number;
  review: string;
  adminReplies?: AdminReply[];
  created_at: string;
}

const Reviews: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', page],
    queryFn: () => getReviews(page, 10),
  });
  const reviews = data?.data?.reviews || data?.reviews || [];
  React.useEffect(() => {
    if (data?.results) {
      setTotalPages(Math.ceil(data.results / 10));
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (err: any) => {
      alert('Lỗi khi xóa đánh giá: ' + (err?.response?.data?.message || err.message));
    }
  });

  const [replyingReviewId, setReplyingReviewId] = React.useState<string | null>(null);
  const [editingReplyIndex, setEditingReplyIndex] = React.useState<number | null>(null);
  const [replyContent, setReplyContent] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const addReplyMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => addAdminReply(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReplyingReviewId(null);
      setReplyContent('');
      setSuccessMsg('Phản hồi thành công!');
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg('Lỗi khi phản hồi: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccessMsg(null);
    }
  });
  const editReplyMutation = useMutation({
    mutationFn: ({ id, replyIndex, content }: { id: string; replyIndex: number; content: string }) => editAdminReply(id, replyIndex, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReplyingReviewId(null);
      setEditingReplyIndex(null);
      setReplyContent('');
      setSuccessMsg('Cập nhật phản hồi thành công!');
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg('Lỗi khi cập nhật phản hồi: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccessMsg(null);
    }
  });
  const deleteReplyMutation = useMutation({
    mutationFn: ({ id, replyIndex }: { id: string; replyIndex: number }) => deleteAdminReply(id, replyIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReplyingReviewId(null);
      setEditingReplyIndex(null);
      setReplyContent('');
      setSuccessMsg('Xóa phản hồi thành công!');
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg('Lỗi khi xóa phản hồi: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccessMsg(null);
    }
  });

  const handleReply = (id: string, reply: string) => {
    if (!reply.trim()) {
      setErrorMsg('Nội dung phản hồi không được để trống!');
      setSuccessMsg(null);
      return;
    }
    // This function is no longer used for the main reply, but kept for consistency
    // The new logic uses addReplyMutation and editReplyMutation
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Đánh giá</h1>
      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi khi tải dữ liệu: {(error as any).message}</p>}
      {errorMsg && <div className="text-red-500 mb-4 font-semibold">{errorMsg}</div>}
      {successMsg && <div className="text-green-500 mb-4 font-semibold">{successMsg}</div>}
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
                <th className="border p-2 text-left">Phản hồi admin</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: Review) => (
                <tr key={review._id} className="hover:bg-gray-100">
                  <td className="border p-2">{review.idProduct?.nameProduct || 'N/A'}</td>
                  <td className="border p-2">{review.idUser?.name || 'N/A'}</td>
                  <td className="border p-2">{review.rating} ⭐</td>
                  <td className="border p-2">{review.review}</td>
                  <td className="border p-2">{new Date(review.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteMutation.mutate(review._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                      disabled={deleteMutation.isPending}
                    >
                      Xóa
                    </button>
                  </td>
                  <td className="border p-2">
                    <div className="flex flex-col gap-2">
                      {(review.adminReplies && review.adminReplies.length > 0) ? (
                        review.adminReplies.map((reply, idx) => (
                          <div key={idx} className="mb-2 p-2 bg-gray-50 rounded border">
                            {replyingReviewId === review._id && editingReplyIndex === idx ? (
                              <>
                                <textarea
                                  className="border rounded p-1 w-full"
                                  value={replyContent}
                                  onChange={e => setReplyContent(e.target.value)}
                                  placeholder="Nhập phản hồi..."
                                />
                                <div className="mt-1 flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi này không?')) {
                                        if (!replyContent.trim()) {
                                          deleteReplyMutation.mutate({ id: review._id, replyIndex: idx });
                                        } else {
                                          editReplyMutation.mutate({ id: review._id, replyIndex: idx, content: replyContent });
                                        }
                                      }
                                    }}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                    disabled={editReplyMutation.isPending && editingReplyIndex === idx}
                                  >Lưu</button>
                                  <button
                                    onClick={() => { setReplyingReviewId(null); setEditingReplyIndex(null); setReplyContent(''); }}
                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                  >Hủy</button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-green-700 font-semibold">{reply.content}</div>
                                <div className="text-xs text-gray-500">{reply.admin && typeof reply.admin === 'object' ? reply.admin.name : ''} - {new Date(reply.updatedAt || reply.createdAt).toLocaleString('vi-VN')}</div>
                                <div className="flex gap-2 mt-1">
                                  <button
                                    onClick={() => { setReplyingReviewId(review._id); setEditingReplyIndex(idx); setReplyContent(reply.content); }}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                  >Sửa</button>
                                  <button
                                    onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) deleteReplyMutation.mutate({ id: review._id, replyIndex: idx }); }}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                  >Xóa</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : null}
                      {/* Thêm mới phản hồi */}
                      {replyingReviewId === review._id && editingReplyIndex === null ? (
                        <div className="mt-2">
                          <textarea
                            className="border rounded p-1 w-full"
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder="Nhập phản hồi mới..."
                          />
                          <div className="mt-1 flex gap-2">
                            <button
                              onClick={() => {
                                if (!replyContent.trim()) {
                                  setErrorMsg('Nội dung phản hồi không được để trống!');
                                  setSuccessMsg(null);
                                  return;
                                }
                                addReplyMutation.mutate({ id: review._id, content: replyContent });
                              }}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                              disabled={addReplyMutation.isPending}
                            >Lưu</button>
                            <button
                              onClick={() => { setReplyingReviewId(null); setReplyContent(''); }}
                              className="bg-gray-400 text-white px-2 py-1 rounded"
                            >Hủy</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setReplyingReviewId(review._id); setEditingReplyIndex(null); setReplyContent(''); }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
                        >Phản hồi</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  );
};

export default Reviews;