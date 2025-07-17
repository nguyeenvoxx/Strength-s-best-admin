import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVouchers, createVoucher, updateVoucher, deleteVoucher } from '../services/api';

interface Voucher {
  _id: string;
  code: string;
  discount: number;
  expiryDate: string;
}

const Voucher: React.FC = () => {
  const queryClient = useQueryClient();
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: 0, expiryDate: '' });
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const { data: vouchers = [], isLoading, error } = useQuery<Voucher[]>({
    queryKey: ['vouchers'],
    queryFn: getVouchers,
  });

  const createMutation = useMutation({
    mutationFn: (data: { code: string; discount: number; expiryDate: string }) => createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setNewVoucher({ code: '', discount: 0, expiryDate: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Voucher> }) => updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setEditingVoucher(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });

  const handleAdd = () => {
    if (newVoucher.code.trim() && newVoucher.discount > 0 && newVoucher.expiryDate) {
      createMutation.mutate(newVoucher);
    }
  };

  const handleUpdate = () => {
    if (editingVoucher) {
      const { _id, ...dataToUpdate } = editingVoucher;
      updateMutation.mutate({ id: _id, data: dataToUpdate });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, voucher: Voucher) => {
    setEditingVoucher({ ...voucher, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Mã giảm giá</h1>
      <div className="mb-6 flex space-x-2">
        <input type="text" value={newVoucher.code} onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })} placeholder="Mã" className="p-2 border rounded" />
        <input type="number" value={newVoucher.discount} onChange={(e) => setNewVoucher({ ...newVoucher, discount: parseInt(e.target.value) || 0 })} placeholder="Giảm giá (%)" className="p-2 border rounded" />
        <input type="date" value={newVoucher.expiryDate} onChange={(e) => setNewVoucher({ ...newVoucher, expiryDate: e.target.value })} className="p-2 border rounded" />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </div>
      
      {isLoading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi: {(error as any).message}</p>}

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Mã</th>
            <th className="p-2 text-left">Giảm giá</th>
            <th className="p-2 text-left">Ngày hết hạn</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              {editingVoucher?._id === voucher._id ? (
                <>
                  <td className="p-2"><input name="code" value={editingVoucher.code} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><input type="number" name="discount" value={editingVoucher.discount} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><input type="date" name="expiryDate" value={editingVoucher.expiryDate.split('T')[0]} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2">
                    <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Lưu</button>
                    <button onClick={() => setEditingVoucher(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Hủy</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{voucher.code}</td>
                  <td className="p-2">{voucher.discount}%</td>
                  <td className="p-2">{new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</td>
                  <td className="p-2">
                    <button onClick={() => setEditingVoucher(voucher)} className="text-yellow-500 hover:underline mr-2">Sửa</button>
                    <button onClick={() => deleteMutation.mutate(voucher._id)} className="text-red-600 hover:underline">Xóa</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Voucher; 