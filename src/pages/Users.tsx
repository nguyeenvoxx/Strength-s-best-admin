import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser, deleteUser } from '../services/api';
import type { UseQueryResult } from '@tanstack/react-query';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
    mutationFn: ({ id, data }: { id: string, data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    },
    onError: (err: any) => {
      alert('Lỗi khi cập nhật người dùng: ' + (err?.response?.data?.message || err.message));
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      alert('Lỗi khi xóa người dùng: ' + (err?.response?.data?.message || err.message));
    }
  });

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleSave = () => {
    if (editingUser) {
      const { _id, ...dataToUpdate } = editingUser;
      updateUserMutation.mutate({ id: _id, data: dataToUpdate });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      deleteUserMutation.mutate(id);
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
                <th className="border p-2 text-left">Tên</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Số điện thoại</th>
                <th className="border p-2 text-left">Địa chỉ</th>
                <th className="border p-2 text-left">Vai trò</th>
                <th className="border p-2 text-left">Trạng thái</th>
                <th className="border p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id}>
                  {editingUser?._id === user._id ? (
                    <>
                      <td className="border p-2"><input name="name" value={editingUser.name} onChange={handleInputChange} className="p-1 border rounded w-full" /></td>
                      <td className="border p-2"><input name="email" value={editingUser.email} onChange={handleInputChange} className="p-1 border rounded w-full" /></td>
                      <td className="border p-2"><input name="phoneNumber" value={editingUser.phoneNumber || ''} onChange={handleInputChange} className="p-1 border rounded w-full" /></td>
                      <td className="border p-2"><input name="address" value={editingUser.address || ''} onChange={handleInputChange} className="p-1 border rounded w-full" /></td>
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
                      <td className="border p-2">{user.address}</td>
                      <td className="border p-2">{user.role}</td>
                      <td className="border p-2">{user.status}</td>
                      <td className="border p-2">
                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                        <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;