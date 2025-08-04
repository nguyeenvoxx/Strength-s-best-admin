import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory, restoreCategory, getAllCategories, getCategoryRelatedProductsCount } from '../services/api';

interface Category {
  _id: string;
  nameCategory: string;
  status?: 'active' | 'inactive';
}

const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [forceDelete, setForceDelete] = useState(false); // Thêm biến này để xác nhận lần 2
  const [relatedCount, setRelatedCount] = useState<number | null>(null);

  const { data: categories = [], isLoading, error: queryError } = useQuery<Category[]>({
    queryKey: ['categories', showInactive],
    queryFn: () => getAllCategories(), // luôn lấy tất cả, filter ở FE
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory({ nameCategory: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
      setSuccess('Thêm danh mục thành công!');
      setError(null);
    },
    onError: (err: any) => {
      setError('Lỗi khi thêm danh mục: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccess(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, { nameCategory: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      setSuccess('Cập nhật danh mục thành công!');
      setError(null);
    },
    onError: (err: any) => {
      setError('Lỗi khi cập nhật danh mục: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccess(null);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      const message = data.message || 'Xóa danh mục thành công!';
      setSuccess(message);
      setError(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Không xác định';
      setError('Lỗi khi xóa danh mục: ' + msg);
      setSuccess(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSuccess('Khôi phục danh mục thành công!');
      setError(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Không xác định';
      setError('Lỗi khi khôi phục danh mục: ' + msg);
      setSuccess(null);
    },
  });
  
  const handleAdd = () => {
    if (!newCategoryName.trim()) {
      setError('Tên danh mục không được để trống');
      setSuccess(null);
      return;
    }
    createMutation.mutate(newCategoryName.trim());
  };

  const handleUpdate = () => {
    if (editingCategory) {
      if (!editingCategory.nameCategory.trim()) {
        setError('Tên danh mục không được để trống');
        setSuccess(null);
        return;
      }
      updateMutation.mutate({ id: editingCategory._id, name: editingCategory.nameCategory.trim() });
    }
  };
  
  const handleDeleteClick = async (category: Category) => {
    setCategoryToDelete(category);
    setForceDelete(false);
    setRelatedCount(null);
    // Gọi API đếm sản phẩm liên quan
    const count = await getCategoryRelatedProductsCount(category._id);
    setRelatedCount(count);
    if (count > 0) {
      setPopupMessage(`Danh mục này còn ${count} sản phẩm liên quan. Bạn có chắc chắn muốn ẩn danh mục và ẩn toàn bộ sản phẩm liên quan không?`);
    } else {
      setPopupMessage(`Bạn có chắc chắn muốn ẩn danh mục "${category.nameCategory}" không?`);
    }
    setShowPopup(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete._id, {
        onSuccess: (data: any) => {
          queryClient.invalidateQueries({ queryKey: ['categories'] });
          setSuccess(data.message || 'Ẩn thành công!');
          setShowPopup(false);
          setCategoryToDelete(null);
          setForceDelete(false);
          setRelatedCount(null);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Không xác định';
          setError('Lỗi khi ẩn danh mục: ' + msg);
          setShowPopup(false);
          setCategoryToDelete(null);
          setForceDelete(false);
          setRelatedCount(null);
        },
      });
    }
  };

  const handleRestore = (category: Category) => {
    if (confirm(`Bạn có chắc chắn muốn khôi phục danh mục "${category.nameCategory}" không?`)) {
      restoreMutation.mutate(category._id);
    }
  };
  
  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category }); // Luôn clone để form luôn nhận giá trị mới
  };

  // Filter danh sách theo trạng thái
  const filteredCategories = categories.filter(c => showInactive ? c.status === 'inactive' : c.status === 'active');

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục</h1>
      
      {/* Thông báo */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {/* Toggle hiển thị inactive */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="mr-2"
          />
          Hiển thị danh mục đã ẩn
        </label>
      </div>

      {/* Form thêm mới */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Thêm danh mục mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Tên danh mục"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAdd}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
      </div>

      {/* Danh sách danh mục */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Danh sách danh mục</h2>
        </div>
        {isLoading ? (
          <div className="p-4">Đang tải...</div>
        ) : (
          <div className="divide-y">
            {filteredCategories.map((category) => (
              <div key={category._id} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${category.status === 'inactive' ? 'text-gray-500 line-through' : ''}`}>
                      {category.nameCategory}
                    </span>
                    {category.status === 'inactive' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Đã ẩn</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {category.status === 'inactive' ? (
                    <button
                      onClick={() => handleRestore(category)}
                      disabled={restoreMutation.isPending}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      Khôi phục
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Ẩn
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup xác nhận */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
            <p className="mb-4">{popupMessage}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setForceDelete(false);
                  setRelatedCount(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form sửa */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Sửa danh mục</h3>
            <input
              type="text"
              value={editingCategory.nameCategory}
              onChange={(e) => setEditingCategory({ ...editingCategory, nameCategory: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;