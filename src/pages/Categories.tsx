import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<{ _id: string; nameCategory: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState<{ _id: string; nameCategory: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/v1/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 200) {
          // Kiểm tra cấu trúc dữ liệu từ API
          if (response.data.status === 'thành công' && Array.isArray(response.data.data?.categories)) {
            setCategories(response.data.data.categories);
          } else {
            setError('Dữ liệu trả về từ API không chứa danh sách danh mục');
          }
        } else {
          setError(`Yêu cầu thất bại với mã trạng thái: ${response.status}`);
        }
      } catch (err) {
        const errorMsg = (err as any).response?.status === 404
          ? 'Endpoint /api/v1/categories không tồn tại. Vui lòng kiểm tra cấu hình backend.'
          : 'Lỗi khi lấy danh sách danh mục: ' + (err as Error).message;
        setError(errorMsg);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }
    setError(null);
    try {
      const response = await axios.post('/api/v1/categories', { nameCategory: newCategory }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 200 || response.status === 201) {
        setCategories([...categories, response.data.data.category]);
        setNewCategory('');
      } else {
        setError(`Thêm danh mục thất bại với mã trạng thái: ${response.status}`);
      }
    } catch (err) {
      const errorMsg = (err as any).response?.status === 404
        ? 'Endpoint /api/v1/categories không tồn tại. Vui lòng kiểm tra backend.'
        : 'Lỗi khi thêm danh mục: ' + (err as Error).message;
      setError(errorMsg);
      console.error('Error adding category:', err);
    }
  };

  const handleDeleteCategory = async (_id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setError(null);
      try {
        const response = await axios.delete(`/api/v1/categories/${_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 200) {
          setCategories(categories.filter(c => c._id !== _id));
        } else {
          setError(`Xóa danh mục thất bại với mã trạng thái: ${response.status}`);
        }
      } catch (err) {
        const errorMsg = (err as any).response?.status === 404
          ? 'Endpoint /api/v1/categories/:id không tồn tại. Vui lòng kiểm tra backend.'
          : 'Lỗi khi xóa danh mục: ' + (err as Error).message;
        setError(errorMsg);
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleEditCategory = (category: { _id: string; nameCategory: string }) => {
    setEditCategory(category);
    setEditValue(category.nameCategory);
  };

  const handleSaveEdit = async (_id: string) => {
    if (!editValue.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }
    if (window.confirm('Bạn có chắc muốn cập nhật danh mục này?')) {
      setError(null);
      try {
        const response = await axios.put(`/api/v1/categories/${_id}`, { nameCategory: editValue }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 200) {
          setCategories(categories.map(c => c._id === _id ? response.data.data.category : c));
          setEditCategory(null);
          setEditValue('');
        } else {
          setError(`Cập nhật danh mục thất bại với mã trạng thái: ${response.status}`);
        }
      } catch (err) {
        const errorMsg = (err as any).response?.status === 404
          ? 'Endpoint /api/v1/categories/:id không tồn tại. Vui lòng kiểm tra backend.'
          : 'Lỗi khi cập nhật danh mục: ' + (err as Error).message;
        setError(errorMsg);
        console.error('Error updating category:', err);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Danh mục</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500 mb-4">Đang tải...</div>}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm Danh mục mới</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên danh mục"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Thêm
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Danh mục</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              {editCategory?._id === category._id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSaveEdit(category._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditCategory(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded-lg hover:bg-gray-500"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-800">{category.nameCategory}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default Categories;