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

  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
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
    if (newCategoryName.trim()) createMutation.mutate(newCategoryName);
  };

  const handleUpdate = () => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, name: editingCategory.nameCategory });
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
      {error && <p className="text-red-500">Lỗi: {(error as any).message}</p>}

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