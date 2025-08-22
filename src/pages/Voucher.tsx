import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVouchers, createVoucher, updateVoucher, deleteVoucher } from '../services/api';
import { Modal, Form, Input, InputNumber, DatePicker, Button, message, Select, Switch } from 'antd';
import dayjs from 'dayjs';

interface Voucher {
  _id: string;
  code: string;
  discount: number;
  expiryDate: string;
  description: string;
  count: number;
  status: 'active' | 'expired' | 'disabled';
  pointsRequired: number;
  isExchangeable: boolean;
  conditions?: {
    minOrderValue?: number;
    userLimit?: number;
  };
}

const VoucherPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

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
    mutationFn: (data: any) => createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setModalOpen(false);
      form.resetFields();
      message.success('Thêm voucher thành công!');
    },
    onError: (err: any) => {
      message.error('Lỗi khi thêm voucher: ' + (err?.response?.data?.message || 'Không xác định'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setModalOpen(false);
      setEditingVoucher(null);
      form.resetFields();
      message.success('Cập nhật voucher thành công!');
    },
    onError: (err: any) => {
      message.error('Lỗi khi cập nhật voucher: ' + (err?.response?.data?.message || 'Không xác định'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      message.success('Đã xóa voucher');
    },
    onError: (err: any) => {
      message.error('Lỗi khi xóa voucher: ' + (err?.response?.data?.message || 'Không xác định'));
    }
  });

  const openAddModal = () => {
    setEditingVoucher(null);
    form.resetFields();
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormError(null);
    form.setFieldsValue({
      code: voucher.code,
      discount: Number(voucher.discount),
      expiryDate: voucher.expiryDate ? dayjs(voucher.expiryDate) : undefined,
      description: voucher.description,
      count: Number(voucher.count),
      pointsRequired: Number(voucher.pointsRequired || 0),
      isExchangeable: voucher.isExchangeable !== false,
      minOrderValue: voucher.conditions?.minOrderValue ? Number(voucher.conditions.minOrderValue) : undefined,
      userLimit: voucher.conditions?.userLimit ? Number(voucher.conditions.userLimit) : undefined,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      setFormError(null);
      await form.validateFields();
      const values = form.getFieldsValue();
      const payload = {
        code: values.code.trim(),
        discount: Number(values.discount),
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
        description: values.description.trim(),
        count: Number(values.count),
        pointsRequired: Number(values.pointsRequired || 0),
        isExchangeable: values.isExchangeable !== false,
        conditions: {
          minOrderValue: values.minOrderValue ? Number(values.minOrderValue) : undefined,
          userLimit: values.userLimit ? Number(values.userLimit) : undefined,
        }
      };

      if (editingVoucher) {
        await updateMutation.mutateAsync({ id: editingVoucher._id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      form.resetFields();
      setEditingVoucher(null);
      setModalOpen(false);
    } catch (err) {
      // validate error
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingVoucher(null);
    form.resetFields();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Mã giảm giá</h1>
      <Button type="primary" onClick={openAddModal} className="mb-4">Thêm voucher</Button>
      <Modal
        open={modalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        title={editingVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher'}
        centered
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
        closeIcon={<span style={{ fontSize: 20, fontWeight: 700 }}>&times;</span>}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" initialValues={{ 
          code: '', 
          discount: 1, 
          expiryDate: undefined, 
          description: '', 
          count: 1, 
          pointsRequired: 0,
          isExchangeable: true,
          minOrderValue: 0, 
          userLimit: 0 
        }}>
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[
              { required: true, message: 'Nhập mã voucher' },
              { min: 3, message: 'Mã voucher tối thiểu 3 ký tự' },
              { pattern: /^[A-Za-z0-9_-]+$/, message: 'Mã voucher chỉ gồm chữ, số, - và _' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá (%)" rules={[{ required: true, type: 'number', min: 1, max: 100, message: 'Nhập giảm giá từ 1 đến 100' }]}> 
            <InputNumber 
              min={1} 
              max={100} 
              className="w-full" 
              parser={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              formatter={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              stringMode={false}
            /> 
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Ngày hết hạn"
            rules={[
              { required: true, message: 'Chọn ngày hết hạn' },
              { validator: (_, value) => value && value.isAfter(dayjs()) ? Promise.resolve() : Promise.reject('Ngày hết hạn phải lớn hơn ngày hiện tại') }
            ]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="count" label="Số lượng" rules={[{ required: true, type: 'number', min: 0, message: 'Nhập số lượng >= 0' }]}> 
            <InputNumber 
              min={0} 
              className="w-full" 
              parser={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              formatter={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              stringMode={false}
            /> 
          </Form.Item>
          <Form.Item name="pointsRequired" label="Điểm yêu cầu (rewards)" rules={[{ required: true, type: 'number', min: 0, message: 'Nhập điểm yêu cầu >= 0' }]}> 
            <InputNumber 
              min={0} 
              className="w-full" 
              parser={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              formatter={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              stringMode={false}
            /> 
          </Form.Item>
          <Form.Item name="isExchangeable" label="Có thể đổi bằng điểm" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Nhập mô tả' },
              { min: 5, message: 'Mô tả tối thiểu 5 ký tự' }
            ]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="minOrderValue" label="Giá trị đơn tối thiểu"> 
            <InputNumber 
              min={0} 
              className="w-full" 
              parser={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              formatter={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              stringMode={false}
            /> 
          </Form.Item>
          <Form.Item name="userLimit" label="Số lần mỗi user"> 
            <InputNumber 
              min={0} 
              className="w-full" 
              parser={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              formatter={(value: string | number | undefined) => value ? value.toString().replace(/[^\d]/g, '') : ''} 
              stringMode={false}
            /> 
          </Form.Item>
          {formError && <div className="text-red-500 font-semibold mb-2">{formError}</div>}
        </Form>
      </Modal>
      {isLoading && <p>Đang tải...</p>}
      {apiError && <p className="text-red-500">Lỗi: {(apiError as any).message}</p>}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Mã</th>
            <th className="p-2 text-left">Giảm giá</th>
            <th className="p-2 text-left">Ngày hết hạn</th>
            <th className="p-2 text-left">Số lượng</th>
            <th className="p-2 text-left">Điểm yêu cầu</th>
            <th className="p-2 text-left">Mô tả</th>
            <th className="p-2 text-left">Trạng thái</th>
            <th className="p-2 text-left">Điều kiện</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              <td className="p-2">{voucher.code}</td>
              <td className="p-2">{voucher.discount}%</td>
              <td className="p-2">{
                voucher.expiryDate && !isNaN(Date.parse(voucher.expiryDate))
                  ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN')
                  : 'Không xác định'
              }</td>
              <td className="p-2">{voucher.count}</td>
              <td className="p-2">{voucher.pointsRequired || 0}</td>
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
                <div>Đơn tối thiểu: {voucher.conditions?.minOrderValue ?? 'Không'}</div>
                <div>Số lần/user: {voucher.conditions?.userLimit ?? 'Không'}</div>
                <div>Đổi bằng điểm: {voucher.isExchangeable ? 'Có' : 'Không'}</div>
              </td>
              <td className="p-2">
                <Button type="link" onClick={() => openEditModal(voucher)} className="text-yellow-500">Sửa</Button>
                <Button type="link" danger onClick={() => deleteMutation.mutate(voucher._id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&laquo;</Button>
        
        {/* Logic phân trang gọn */}
        {(() => {
          const pages = [];
          const maxVisiblePages = 3;
          let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
          
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }

          // Thêm trang đầu nếu cần
          if (startPage > 1) {
            pages.push(
              <Button key={1} onClick={() => setPage(1)} type="default">1</Button>
            );
            
            if (startPage > 2) {
              pages.push(
                <span key="dots1" className="px-2 py-1">...</span>
              );
            }
          }

          // Thêm các trang hiển thị
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <Button key={i} onClick={() => setPage(i)} type={i === page ? 'primary' : 'default'}>{i}</Button>
            );
          }

          // Thêm trang cuối nếu cần
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <span key="dots2" className="px-2 py-1">...</span>
              );
            }
            
            pages.push(
              <Button key={totalPages} onClick={() => setPage(totalPages)} type="default">{totalPages}</Button>
            );
          }

          return pages;
        })()}
        
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&raquo;</Button>
      </div>
    </div>
  );
};

export default VoucherPage; 