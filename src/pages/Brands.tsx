import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../services/api';

interface Brand {
  _id: string;
  name: string;
}

const Brands: React.FC = () => {
  const queryClient = useQueryClient();
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const { data: brands = [], isLoading, error } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createBrand({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setNewBrandName('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateBrand(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setEditingBrand(null);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
  
  const handleAdd = () => {
    if (newBrandName.trim()) createMutation.mutate(newBrandName);
  };

  const handleUpdate = () => {
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand._id, name: editingBrand.name });
    }
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Thương hiệu</h1>
      <div className="mb-6">
        <input
          type="text"
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          placeholder="Tên thương hiệu mới"
          className="p-2 border rounded"
        />
        <button onClick={handleAdd} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </div>
      
      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi: {(error as any).message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white p-4 rounded shadow">
            {editingBrand?._id === brand._id ? (
              <div>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  className="p-2 border rounded w-full"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Lưu</button>
                <button onClick={() => setEditingBrand(null)} className="bg-gray-500 text-white px-2 py-1 rounded mt-2 ml-2">Hủy</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{brand.name}</span>
                <div>
                  <button onClick={() => setEditingBrand(brand)} className="text-yellow-500 hover:underline mr-2">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(brand._id)} className="text-red-600 hover:underline">Xóa</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands; 