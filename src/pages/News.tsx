import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getNews, createNews, updateNews, deleteNews } from '../services/api';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error('Lỗi tải tin tức');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditing(item);
    form.setFieldsValue(item);
    setFileList(item.image ? [{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: item.image,
    }] : []);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      message.success('Đã xóa tin tức');
      fetchNews();
    } catch {
      message.error('Lỗi xóa tin tức');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      if (fileList.length && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      } else if (editing && editing.image) {
        formData.append('image', editing.image);
      }
      if (editing) {
        await updateNews(editing._id, formData);
        message.success('Đã cập nhật tin tức');
      } else {
        await createNews(formData);
        message.success('Đã thêm tin tức');
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      // message.error('Lỗi lưu tin tức');
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Ảnh', dataIndex: 'image', key: 'image', render: (img: string) => img ? <img src={img} alt="news" style={{ width: 60 }} /> : null },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => new Date(date).toLocaleString('vi-VN') },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: NewsItem) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa tin này?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    onChange: (info: any) => setFileList(info.fileList.slice(-1)),
    listType: 'picture' as 'picture',
    maxCount: 1,
  };

  return (
    <div>
      <h2>Quản lý tin tức</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm tin tức</Button>
      <Table rowKey="_id" columns={columns} dataSource={news} loading={loading} />
      <Modal
        title={editing ? 'Sửa tin tức' : 'Thêm tin tức'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}> <Input /> </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}> <Input.TextArea rows={4} /> </Form.Item>
          <Form.Item label="Ảnh tin tức">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {fileList.length === 0 && editing && editing.image && (
              <img src={editing.image} alt="news" style={{ width: 80, marginTop: 8 }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default News; 