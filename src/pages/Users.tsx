import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser } from '../services/api';
import type { UseQueryResult } from '@tanstack/react-query';
import ConfirmModal from '../components/ConfirmModal';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  addresses?: Array<{
    _id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
  }>;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, error }: UseQueryResult<any, Error> = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page, 10),
  });
  const users: User[] = data?.data?.users || data?.users || [];
  useEffect(() => {
    if (data?.data?.results) {
      setTotalPages(Math.ceil(data.data.results / 10));
    } else if (data?.results) {
      setTotalPages(Math.ceil(data.results / 10));
    }
  }, [data]);

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateUser(id, data),
    onSuccess: (data, variables) => {
      // Cập nhật ngay lập tức
      queryClient.setQueryData(['users', page], (oldData: any) => {
        if (!oldData) return oldData;
        
        const updatedUsers = oldData.data?.users?.map((user: User) => {
          if (user._id === variables.id) {
            // Cập nhật thông tin user từ response
            const updatedUser = data.data?.user || user;
            return {
              ...user,
              ...updatedUser,
              // Chỉ cập nhật role và status
              role: updatedUser.role || user.role,
              status: updatedUser.status || user.status
            };
          }
          return user;
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            users: updatedUsers
          }
        };
      });

      setEditingUser(null);
      
      // Hiển thị thông báo thành công
      alert('Cập nhật vai trò và trạng thái người dùng thành công!');
      
      // Refresh sau 1 giây để đồng bộ với server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }, 1000);
    },
    onError: (err: any) => {
      alert('Lỗi khi cập nhật người dùng: ' + (err?.response?.data?.message || err.message));
    }
  });



  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedUser(null);
    setShowDetailModal(false);
  };

  const handleSave = () => {
    if (editingUser) {
      // Tìm user gốc để so sánh
      const originalUser = users.find(u => u._id === editingUser._id);
      if (!originalUser) return;

      // Kiểm tra có thay đổi role hoặc status không
      const roleChanged = originalUser.role !== editingUser.role;
      const statusChanged = originalUser.status !== editingUser.status;

      if (roleChanged || statusChanged) {
        let confirmMessage = 'Bạn có chắc chắn muốn thay đổi:\n';
        if (roleChanged) {
          confirmMessage += `- Vai trò từ "${originalUser.role}" sang "${editingUser.role}"\n`;
        }
        if (statusChanged) {
          confirmMessage += `- Trạng thái từ "${originalUser.status}" sang "${editingUser.status}"\n`;
        }
        confirmMessage += '\nThay đổi này sẽ ảnh hưởng đến quyền truy cập của người dùng.';

        setConfirmAction(() => () => {
          const updateData = {
            role: editingUser.role,
            status: editingUser.status
          };
          updateUserMutation.mutate({ id: editingUser._id, data: updateData });
        });
        setShowConfirmModal(true);
        return;
      }

      // Nếu không có thay đổi, thực hiện ngay
      const updateData = {
        role: editingUser.role,
        status: editingUser.status
      };
      updateUserMutation.mutate({ id: editingUser._id, data: updateData });
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h1>

      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi khi tải dữ liệu người dùng.</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Ảnh</th>
                <th className="border p-2 text-left">Tên</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Số điện thoại</th>
                <th className="border p-2 text-left">Vai trò</th>
                <th className="border p-2 text-left">Trạng thái</th>
                <th className="border p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id}>
                  {/* Cột avatar */}
                  <td className="border p-2 text-center">
                    <img
                      src={
                        user.avatarUrl
                          ? user.avatarUrl.startsWith('http')
                            ? user.avatarUrl
                            : user.avatarUrl.startsWith('/uploads/')
                              ? `http://localhost:3000${user.avatarUrl}`
                              : `http://localhost:3000/uploads/avatars/${user.avatarUrl}`
                          : '/assets/default-avatar.png'
                      }
                      alt={user.name}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </td>
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <td className="border p-2">{editingUser.name}</td>
                      <td className="border p-2">{editingUser.email}</td>
                      <td className="border p-2">{editingUser.phoneNumber}</td>
                      <td className="border p-2">
                        <select name="role" value={editingUser.role} onChange={handleInputChange} className="p-1 border rounded w-full">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <select name="status" value={editingUser.status} onChange={handleInputChange} className="p-1 border rounded w-full">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Lưu</button>
                        <button onClick={handleCancel} className="bg-gray-500 text-white px-2 py-1 rounded">Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">{user.phoneNumber}</td>
                      <td className="border p-2">{user.role}</td>
                      <td className="border p-2">{user.status}</td>
                      <td className="border p-2">
                        <button onClick={() => handleViewDetail(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Xem chi tiết</button>
                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded">Sửa</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>

      {/* Modal chi tiết user */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={handleCloseDetail} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            <h2 className="text-xl font-bold mb-4 text-gray-700">Chi tiết người dùng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedUser.avatarUrl
                        ? selectedUser.avatarUrl.startsWith('http')
                          ? selectedUser.avatarUrl
                          : selectedUser.avatarUrl.startsWith('/uploads/')
                            ? `http://localhost:3000${selectedUser.avatarUrl}`
                            : `http://localhost:3000/uploads/avatars/${selectedUser.avatarUrl}`
                        : '/assets/default-avatar.png'
                    }
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <p className="text-sm text-gray-500">
                      Vai trò: <span className={`font-medium ${selectedUser.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                        {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Trạng thái: <span className={`font-medium ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Thông tin liên hệ</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Số điện thoại:</span> {selectedUser.phoneNumber || 'Chưa cập nhật'}</p>
                    <p><span className="font-medium">Ngày tạo:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}</p>
                    <p><span className="font-medium">Cập nhật lần cuối:</span> {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('vi-VN') : 'Không xác định'}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách địa chỉ */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Danh sách địa chỉ ({selectedUser.addresses?.length || 0})</h4>
                
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={address._id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800">{address.name}</h5>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">SĐT:</span> {address.phone}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Địa chỉ:</span> {address.address}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">Chưa có địa chỉ nào</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleCloseDetail}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Đóng
              </button>
            </div>
                     </div>
         </div>
       )}

       {/* Confirm Modal */}
       <ConfirmModal
         isOpen={showConfirmModal}
         onCancel={() => {
           setShowConfirmModal(false);
           setConfirmAction(null);
         }}
         onConfirm={handleConfirmAction}
         title="Xác nhận thay đổi"
         message="Bạn có chắc chắn muốn thay đổi vai trò hoặc trạng thái của người dùng này? Thay đổi này sẽ ảnh hưởng đến quyền truy cập của người dùng."
         type="warning"
       />
     </div>
   );
 };

export default Users;