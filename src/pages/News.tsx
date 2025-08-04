import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Upload, Card, Space, Tag, Image, Input as AntInput } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getNews, createNews, updateNews, deleteNews } from '../services/api';

const { TextArea } = Input;
const { Search } = AntInput;

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string;
  status?: 'active' | 'inactive';
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form] = Form.useForm<{
    title: string;
    content: string;
  }>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchNews = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...(search && { search })
      };
      const response = await getNews(params);
      
      // Xử lý response từ backend
      let newsData = [];
      let total = 0;
      
      if (response.data && response.data.news) {
        newsData = response.data.news;
        total = response.results || 0;
      } else if (Array.isArray(response)) {
        newsData = response;
        total = response.length;
      } else if (response.news) {
        newsData = response.news;
        total = response.total || 0;
      }
      
      setNews(newsData);
      setPagination(prev => ({
        ...prev,
        current: page,
        total
      }));
    } catch (err: any) {
      message.error('Lỗi tải tin tức: ' + (err?.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(1, searchText);
  }, [searchText]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditing(item);
    form.setFieldsValue({
      title: item.title,
      content: item.content
    });
    
    // Set file list cho ảnh hiện tại
    if (item.image) {
      const imageUrl = item.image.startsWith('http') 
        ? item.image 
        : `http://localhost:3000${item.image}`;
      
      setFileList([{
        uid: '-1',
        name: 'current-image.jpg',
        status: 'done',
        url: imageUrl,
      }]);
    } else {
      setFileList([]);
    }
    
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      message.success('Đã xóa tin tức thành công');
      fetchNews(pagination.current, searchText);
    } catch (err: any) {
      message.error('Lỗi xóa tin tức: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleOk = async (values: { title: string; content: string }) => {
    try {
      let formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('content', values.content.trim());
      
      // Xử lý file upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }
      
      console.log('🔍 Submitting News FormData:', {
        title: values.title.trim(),
        content: values.content.trim(),
        hasImage: fileList.length > 0 && fileList[0].originFileObj
      });
      
      // Debug: Log token
      const token = localStorage.getItem('token');
      console.log('🔍 Token exists:', !!token);
      console.log('🔍 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

      if (editing) {
        await updateNews(editing._id, formData);
        message.success('Đã cập nhật tin tức thành công');
      } else {
        await createNews(formData);
        message.success('Đã thêm tin tức thành công');
      }
      
      setModalOpen(false);
      fetchNews(pagination.current, searchText);
    } catch (err: any) {
      console.error('❌ News creation/update error:', err);
      console.error('❌ Error response:', err?.response?.data);
      console.error('❌ Error status:', err?.response?.status);
      console.error('❌ Error headers:', err?.response?.headers);
      console.error('❌ Error config:', err?.config);
      
      if (err.errorFields) {
        // Validation error từ form
        message.error('Vui lòng kiểm tra lại thông tin');
      } else {
        // API error
        message.error('Lỗi lưu tin tức: ' + (err?.response?.data?.message || err.message));
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleTableChange = (pagination: any) => {
    fetchNews(pagination.current, searchText);
  };

  const API_URL = 'http://localhost:3000';

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (title: string) => (
        <div style={{ fontWeight: 500, color: '#1890ff' }}>
          {title}
        </div>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: '30%',
      ellipsis: true,
      render: (content: string) => (
        <div style={{ 
          maxWidth: 300,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {content}
        </div>
      )
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: '15%',
      render: (image: string) => {
        if (!image) return <span style={{ color: '#999' }}>Không có ảnh</span>;
        
        const src = image.startsWith('http')
          ? image
          : `${API_URL}${image}`;
        
        return (
          <Image
            src={src}
            alt="news"
            width={60}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => (
        <div>
          <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {new Date(date).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '15%',
      render: (_: any, record: NewsItem) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa tin tức này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1));
    },
    listType: 'picture' as 'picture',
    maxCount: 1,
    accept: 'image/*',
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card title="Quản lý tin tức" className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm tin tức..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAdd}
          >
            Thêm tin tức
          </Button>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={news}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tin tức`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editing ? 'Sửa tin tức' : 'Thêm tin tức mới'}
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ title: '', content: '' }}
          onFinish={handleOk}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { max: 200, message: 'Tiêu đề không được quá 200 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tiêu đề tin tức..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Nhập nội dung tin tức..."
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Form.Item label="Ảnh tin tức">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <div style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
              Hỗ trợ: JPG, PNG, GIF. Tối đa: 5MB
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default News; 