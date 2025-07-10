import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editValues, setEditValues] = useState({ name: '', email: '' });

  useEffect(() => {
    axios.get('/api/v1/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setUsers(response.data.data.users))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      axios.post('/api/v1/users', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => setUsers([...users, response.data.data.user]))
        .catch(error => console.error('Error adding user:', error));
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDeleteUser = (_id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      axios.delete(`/api/v1/users/${_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(() => setUsers(users.filter(u => u._id !== _id)))
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setEditValues({ name: user.name, email: user.email });
  };

  const handleSaveEdit = (_id: string) => {
    if (editValues.name && editValues.email) {
      axios.put(`/api/v1/users/${_id}`, editValues, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => {
          setUsers(users.map(u => u._id === _id ? response.data.data.user : u));
          setEditUser(null);
          setEditValues({ name: '', email: '' });
        })
        .catch(error => console.error('Error updating user:', error));
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm Người dùng mới</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên"
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <button
            onClick={handleAddUser}
            className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Thêm
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Người dùng</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Tên</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  {editUser?._id === user._id ? (
                    <td colSpan={3} className="border p-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="w-1/3 p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="email"
                          value={editValues.email}
                          onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                          className="w-1/3 p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={() => handleSaveEdit(user._id)}
                          className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditUser(null)}
                          className="bg-gray-400 text-white px-2 py-1 rounded-lg hover:bg-gray-500"
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   
    </div>
  );
};

export default Users;