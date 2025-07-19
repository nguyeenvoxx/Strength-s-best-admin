import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVouchers, createVoucher, updateVoucher, deleteVoucher, setVoucherStatus, updateVoucherConditions } from '../services/api';

interface Voucher {
  _id: string;
  code: string;
  discount: number;
  expiryDate: string;
  description: string;
  count: number;
  status: 'active' | 'expired' | 'disabled';
  conditions?: {
    minOrderValue?: number;
    userLimit?: number;
  };
}

const Voucher: React.FC = () => {
  const queryClient = useQueryClient();
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: 0, expiryDate: '', description: '', count: 100 });
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingConditionsId, setEditingConditionsId] = useState<string | null>(null);
  const [conditionDraft, setConditionDraft] = useState<{ minOrderValue?: number; maxDiscount?: number; userLimit?: number }>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, error: apiError } = useQuery({
    queryKey: ['vouchers', page],
    queryFn: () => getVouchers(page, 10),
  });
  const vouchers: Voucher[] = data?.data?.vouchers || data?.vouchers || [];
  useEffect(() => {
    if (data?.results) {
      setTotalPages(Math.ceil(data.results / 10));
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: (data: { code: string; discount: number; expiryDate: string; description: string; count: number }) => createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setNewVoucher({ code: '', discount: 0, expiryDate: '', description: '', count: 100 });
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

  const setStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'disabled' }) => setVoucherStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vouchers'] })
  });
  const updateCondMutation = useMutation({
    mutationFn: ({ id, conditions }: { id: string; conditions: any }) => updateVoucherConditions(id, conditions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setEditingConditionsId(null);
    }
  });

  const validateInput = (): string | null => {
    if (!newVoucher.code.trim()) return 'Mã voucher không được để trống';
    if (newVoucher.discount <= 0 || newVoucher.discount > 100) return 'Giảm giá phải từ 1 đến 100';
    if (!newVoucher.expiryDate) return 'Vui lòng chọn ngày hết hạn';
    if (!newVoucher.description.trim()) return 'Mô tả không được để trống';
    if (!Number.isInteger(newVoucher.count) || newVoucher.count < 0) return 'Số lượng phải là số nguyên không âm';
    return null;
  };

  const handleAdd = () => {
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }
    createMutation.mutate({ ...newVoucher, description: newVoucher.description || '', count: newVoucher.count }, {
      onError: (err: any) => {
        setError('Lỗi khi thêm voucher: ' + (err?.response?.data?.message || 'Không xác định'));
        setSuccess(null);
      },
      onSuccess: () => {
        setSuccess('Thêm voucher thành công!');
        setError(null);
      }
    });
  };

  const handleUpdate = () => {
    if (editingVoucher) {
      const { _id, code, discount, expiryDate, description, count } = editingVoucher;
      if (!code.trim() || !description.trim() || !expiryDate || discount <= 0 || discount > 100 || !Number.isInteger(count) || count < 0) {
        setError('Vui lòng nhập đầy đủ và hợp lệ các trường!');
        setSuccess(null);
        return;
      }
      updateMutation.mutate({ id: _id, data: { code: code.trim(), discount, expiryDate, description: description.trim(), count } }, {
        onError: (err: any) => {
          setError('Lỗi khi cập nhật voucher: ' + (err?.response?.data?.message || 'Không xác định'));
          setSuccess(null);
        },
        onSuccess: () => {
          setSuccess('Cập nhật voucher thành công!');
          setError(null);
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, voucher: Voucher) => {
    const { name, value } = e.target;
    setEditingVoucher({ ...voucher, [name]: name === 'discount' || name === 'count' ? Number(value) : value });
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Mã giảm giá</h1>
      <div className="mb-6 flex space-x-2 items-center">
        <label className="font-semibold">Mã:</label>
        <input type="text" value={newVoucher.code} onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })} placeholder="Mã" className="p-2 border rounded" />
        <label className="font-semibold">Giảm giá (%):</label>
        <input type="number" value={newVoucher.discount} min={1} max={100} onChange={(e) => setNewVoucher({ ...newVoucher, discount: parseInt(e.target.value) || 0 })} placeholder="Giảm giá (%)" className="p-2 border rounded" />
        <label className="font-semibold">Ngày hết hạn:</label>
        <input type="date" value={newVoucher.expiryDate} onChange={(e) => setNewVoucher({ ...newVoucher, expiryDate: e.target.value })} className="p-2 border rounded" />
        <label className="font-semibold">Số lượng:</label>
        <input type="number" value={newVoucher.count} min={0} onChange={(e) => setNewVoucher({ ...newVoucher, count: parseInt(e.target.value) || 0 })} placeholder="Số lượng" className="p-2 border rounded" />
        <label className="font-semibold">Mô tả:</label>
        <input type="text" value={newVoucher.description} onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })} placeholder="Mô tả" className="p-2 border rounded" />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </div>
      
      {isLoading && <p>Đang tải...</p>}
      {apiError && <p className="text-red-500">Lỗi: {(apiError as any).message}</p>}
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {success && <div className="text-green-500 mb-4 font-semibold">{success}</div>}

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Mã</th>
            <th className="p-2 text-left">Giảm giá</th>
            <th className="p-2 text-left">Ngày hết hạn</th>
            <th className="p-2 text-left">Số lượng</th>
            <th className="p-2 text-left">Mô tả</th>
            <th className="p-2 text-left">Trạng thái</th>
            <th className="p-2 text-left">Điều kiện</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              {editingVoucher?._id === voucher._id ? (
                <>
                  <td className="p-2"><input name="code" value={editingVoucher.code} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><input type="number" name="discount" value={editingVoucher.discount} min={1} max={100} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><input type="date" name="expiryDate" value={editingVoucher.expiryDate.split('T')[0]} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><input type="number" name="count" value={editingVoucher.count} min={0} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2"><textarea name="description" value={editingVoucher.description} onChange={(e) => handleInputChange(e, editingVoucher)} className="p-1 border rounded w-full" /></td>
                  <td className="p-2">
                    <span className={
                      editingVoucher.status === 'active' ? 'text-green-600 font-semibold' :
                      editingVoucher.status === 'expired' ? 'text-gray-500 font-semibold' :
                      'text-red-600 font-semibold'
                    }>
                      {editingVoucher.status === 'active' ? 'Đang hoạt động' : editingVoucher.status === 'expired' ? 'Hết hạn' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="p-2">
                    {editingConditionsId === editingVoucher._id ? (
                      <div className="flex flex-col gap-1">
                        <input type="number" placeholder="Giá trị đơn tối thiểu" value={conditionDraft.minOrderValue ?? ''} onChange={e => setConditionDraft(d => ({ ...d, minOrderValue: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <input type="number" placeholder="Giảm tối đa" value={conditionDraft.maxDiscount ?? ''} onChange={e => setConditionDraft(d => ({ ...d, maxDiscount: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <input type="number" placeholder="Số lần mỗi user" value={conditionDraft.userLimit ?? ''} onChange={e => setConditionDraft(d => ({ ...d, userLimit: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => updateCondMutation.mutate({ id: editingVoucher._id, conditions: conditionDraft })} className="bg-green-500 text-white px-2 py-1 rounded">Lưu</button>
                          <button onClick={() => setEditingConditionsId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Hủy</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>Đơn tối thiểu: {editingVoucher.conditions?.minOrderValue ?? 'Không'}</div>
                        <div>Số lần/user: {editingVoucher.conditions?.userLimit ?? 'Không'}</div>
                        <button onClick={() => { setEditingConditionsId(editingVoucher._id); setConditionDraft({ ...editingVoucher.conditions }); }} className="text-blue-500 hover:underline mt-1">Chỉnh sửa</button>
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Lưu</button>
                    <button onClick={() => setEditingVoucher(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Hủy</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{voucher.code}</td>
                  <td className="p-2">{voucher.discount}%</td>
                  <td className="p-2">{
                    voucher.expiryDate && !isNaN(Date.parse(voucher.expiryDate))
                      ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN')
                      : 'Không xác định'
                  }</td>
                  <td className="p-2">{voucher.count}</td>
                  <td className="p-2">{voucher.description}</td>
                  <td className="p-2">
                    <span className={
                      voucher.status === 'active' ? 'text-green-600 font-semibold' :
                      voucher.status === 'expired' ? 'text-gray-500 font-semibold' :
                      'text-red-600 font-semibold'
                    }>
                      {voucher.status === 'active' ? 'Đang hoạt động' : voucher.status === 'expired' ? 'Hết hạn' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="p-2">
                    {editingConditionsId === voucher._id ? (
                      <div className="flex flex-col gap-1">
                        <input type="number" placeholder="Giá trị đơn tối thiểu" value={conditionDraft.minOrderValue ?? ''} onChange={e => setConditionDraft(d => ({ ...d, minOrderValue: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <input type="number" placeholder="Giảm tối đa" value={conditionDraft.maxDiscount ?? ''} onChange={e => setConditionDraft(d => ({ ...d, maxDiscount: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <input type="number" placeholder="Số lần mỗi user" value={conditionDraft.userLimit ?? ''} onChange={e => setConditionDraft(d => ({ ...d, userLimit: e.target.value ? Number(e.target.value) : undefined }))} className="border p-1 rounded mb-1" />
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => updateCondMutation.mutate({ id: voucher._id, conditions: conditionDraft })} className="bg-green-500 text-white px-2 py-1 rounded">Lưu</button>
                          <button onClick={() => setEditingConditionsId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Hủy</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>Đơn tối thiểu: {voucher.conditions?.minOrderValue ?? 'Không'}</div>
                        <div>Số lần/user: {voucher.conditions?.userLimit ?? 'Không'}</div>
                        <button onClick={() => { setEditingConditionsId(voucher._id); setConditionDraft({ ...voucher.conditions }); }} className="text-blue-500 hover:underline mt-1">Chỉnh sửa</button>
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <button onClick={() => setEditingVoucher(voucher)} className="text-yellow-500 hover:underline mr-2">Sửa</button>
                    <button onClick={() => deleteMutation.mutate(voucher._id)} className="text-red-600 hover:underline mr-2">Xóa</button>
                    {voucher.status === 'active' ? (
                      <button onClick={() => setStatusMutation.mutate({ id: voucher._id, status: 'disabled' })} className="bg-red-500 text-white px-2 py-1 rounded">Vô hiệu hóa</button>
                    ) : (
                      <button onClick={() => setStatusMutation.mutate({ id: voucher._id, status: 'active' })} className="bg-green-600 text-white px-2 py-1 rounded">Kích hoạt lại</button>
                    )}
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
  );
};

export default Voucher; 