import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, updateBrand, deleteBrand, restoreBrand, getAllBrands, getBrandRelatedProductsCount } from '../services/api';

interface Brand {
  _id: string;
  name: string;
  status?: 'active' | 'inactive';
}

const Brands: React.FC = () => {
  const queryClient = useQueryClient();
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [relatedCount, setRelatedCount] = useState<number | null>(null);

  const { data: brands = [], isLoading, error: queryError } = useQuery<Brand[]>({
    queryKey: ['brands', showInactive],
    queryFn: () => getAllBrands(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createBrand({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setNewBrandName('');
      setSuccess('Thêm thương hiệu thành công!');
      setError(null);
    },
    onError: (err: any) => {
      setError('Lỗi khi thêm thương hiệu: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccess(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateBrand(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setEditingBrand(null);
      setSuccess('Cập nhật thương hiệu thành công!');
      setError(null);
    },
    onError: (err: any) => {
      setError('Lỗi khi cập nhật thương hiệu: ' + (err?.response?.data?.message || 'Không xác định'));
      setSuccess(null);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      const message = data.message || 'Ẩn thương hiệu thành công!';
      setSuccess(message);
      setError(null);
      setShowPopup(false);
      setBrandToDelete(null);
      setForceDelete(false);
      setRelatedCount(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Không xác định';
      setError('Lỗi khi ẩn thương hiệu: ' + msg);
      setSuccess(null);
      setShowPopup(false);
      setBrandToDelete(null);
      setForceDelete(false);
      setRelatedCount(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setSuccess('Khôi phục thương hiệu thành công!');
      setError(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Không xác định';
      setError('Lỗi khi khôi phục thương hiệu: ' + msg);
      setSuccess(null);
    },
  });
  
  const handleAdd = () => {
    if (newBrandName.trim()) {
      createMutation.mutate(newBrandName.trim());
    } else {
      setError('Tên thương hiệu không được để trống');
      setSuccess(null);
    }
  };

  const handleUpdate = () => {
    if (editingBrand && editingBrand.name.trim()) {
      updateMutation.mutate({ id: editingBrand._id, name: editingBrand.name.trim() });
    } else {
      setError('Tên thương hiệu không được để trống');
      setSuccess(null);
    }
  };
  
  const handleDeleteClick = async (brand: Brand) => {
    setBrandToDelete(brand);
    setForceDelete(false);
    setRelatedCount(null);
    setError(null);
    setSuccess(null);
    
    try {
      // Gọi API đếm sản phẩm liên quan
      const count = await getBrandRelatedProductsCount(brand._id);
      setRelatedCount(count);
      if (count > 0) {
        setPopupMessage(`Thương hiệu này còn ${count} sản phẩm liên quan. Bạn có chắc chắn muốn ẩn thương hiệu và ẩn toàn bộ sản phẩm liên quan không?`);
      } else {
        setPopupMessage(`Bạn có chắc chắn muốn ẩn thương hiệu "${brand.name}" không?`);
      }
      setShowPopup(true);
    } catch (error) {
      setError('Lỗi khi kiểm tra sản phẩm liên quan');
      setSuccess(null);
    }
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      deleteMutation.mutate(brandToDelete._id);
    }
  };

  const handleRestore = (brand: Brand) => {
    if (confirm(`Bạn có chắc chắn muốn khôi phục thương hiệu "${brand.name}" không?`)) {
      restoreMutation.mutate(brand._id);
    }
  };
  
  const handleEdit = (brand: Brand) => {
    setEditingBrand({ ...brand });
    setError(null);
    setSuccess(null);
  };

  // Filter danh sách theo trạng thái
  const filteredBrands = brands.filter(b => showInactive ? b.status === 'inactive' : b.status === 'active');

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý Thương hiệu</h1>
      
      {/* Error và Success messages */}
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
          Hiển thị thương hiệu đã ẩn
        </label>
      </div>

      {/* Form thêm mới */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Thêm thương hiệu mới</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Tên thương hiệu"
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
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

      {/* Danh sách thương hiệu */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Danh sách thương hiệu</h2>
        </div>
        {isLoading ? (
          <div className="p-4">Đang tải...</div>
        ) : queryError ? (
          <div className="p-4 text-red-600">Lỗi khi tải dữ liệu: {queryError.message}</div>
        ) : (
          <div className="divide-y">
            {filteredBrands.length === 0 ? (
              <div className="p-4 text-gray-500">Không có thương hiệu nào</div>
            ) : (
              filteredBrands.map((brand) => (
                <div key={brand._id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${brand.status === 'inactive' ? 'text-gray-500 line-through' : ''}`}>
                        {brand.name}
                      </span>
                      {brand.status === 'inactive' && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Đã ẩn</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {brand.status === 'inactive' ? (
                      <button
                        onClick={() => handleRestore(brand)}
                        disabled={restoreMutation.isPending}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Khôi phục
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(brand)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(brand)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Ẩn
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
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
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form sửa */}
      {editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Sửa thương hiệu</h3>
            <input
              type="text"
              value={editingBrand.name}
              onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingBrand(null)}
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

export default Brands; 