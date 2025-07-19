import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

interface Category {
  _id: string;
  nameCategory: string;
}

const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: categories = [], isLoading, error: queryError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory({ nameCategory: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, { nameCategory: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
  
  const handleAdd = () => {
    if (!newCategoryName.trim()) {
      setError('Tên danh mục không được để trống');
      setSuccess(null);
      return;
    }
    createMutation.mutate(newCategoryName.trim(), {
      onError: (err: any) => {
        setError('Lỗi khi thêm danh mục: ' + (err?.response?.data?.message || 'Không xác định'));
        setSuccess(null);
      },
      onSuccess: () => {
        setSuccess('Thêm danh mục thành công!');
        setError(null);
      }
    });
  };

  const handleUpdate = () => {
    if (editingCategory) {
      if (!editingCategory.nameCategory.trim()) {
        setError('Tên danh mục không được để trống');
        setSuccess(null);
        return;
      }
      updateMutation.mutate({ id: editingCategory._id, name: editingCategory.nameCategory.trim() }, {
        onError: (err: any) => {
          setError('Lỗi khi cập nhật danh mục: ' + (err?.response?.data?.message || 'Không xác định'));
          setSuccess(null);
        },
        onSuccess: () => {
          setSuccess('Cập nhật danh mục thành công!');
          setError(null);
        }
      });
    }
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Danh mục</h1>
      <div className="mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Tên danh mục mới"
          className="p-2 border rounded"
        />
        <button onClick={handleAdd} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </div>
      
      {isLoading && <p>Đang tải...</p>}
      {queryError && <p className="text-red-500">Lỗi: {(queryError as any).message}</p>}
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {success && <div className="text-green-500 mb-4 font-semibold">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white p-4 rounded shadow">
            {editingCategory?._id === category._id ? (
              <div>
                <input
                  type="text"
                  value={editingCategory.nameCategory}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameCategory: e.target.value })}
                  className="p-2 border rounded w-full"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Lưu</button>
                <button onClick={() => setEditingCategory(null)} className="bg-gray-500 text-white px-2 py-1 rounded mt-2 ml-2">Hủy</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{category.nameCategory}</span>
                <div>
                  <button onClick={() => setEditingCategory(category)} className="text-yellow-500 hover:underline mr-2">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(category._id)} className="text-red-600 hover:underline">Xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;