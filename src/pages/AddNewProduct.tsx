import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProduct, getBrands, getCategories } from '../services/api';
import { Link } from 'react-router-dom';

interface ProductInput {
  nameProduct: string;
  priceProduct: number;
  quantity: number;
  image: string;
  status: string;
  idBrand: string;
  idCategory: string;
  description: string;
}

const AddNewProduct: React.FC = () => {
  const [product, setProduct] = useState<ProductInput>({
    nameProduct: '',
    priceProduct: 0,
    quantity: 1,
    image: '',
    status: 'active',
    idBrand: '',
    idCategory: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: brands = [], isLoading: isLoadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const mutation = useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: (data) => {
      console.log('✅ Product created successfully:', data);
      setSuccess('Thêm sản phẩm thành công!');
      setProduct({
        nameProduct: '',
        priceProduct: 0,
        quantity: 0,
        image: '',
        status: 'active',
        idBrand: '',
        idCategory: '',
        description: '',
      });
      setError(null);
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err: any) => {
      console.error('❌ Product creation error:', err);
      console.error('❌ Error response:', err?.response?.data);
      console.error('❌ Error status:', err?.response?.status);
      console.error('❌ Error headers:', err?.response?.headers);
      console.error('❌ Error config:', err?.config);
      
      let errorMessage = 'Lỗi khi thêm sản phẩm';
      
      if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện hành động này.';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else {
        errorMessage = err?.response?.data?.message || err?.message || 'Lỗi không xác định';
      }
      
      setError(errorMessage);
      setSuccess(null);
    }
  });

  const validateInput = (): string | null => {
    if (!product.nameProduct.trim()) return 'Tên sản phẩm không được để trống';
    if (product.priceProduct <= 0) return 'Giá sản phẩm phải lớn hơn 0';
    if (product.quantity < 1) return 'Số lượng sản phẩm phải lớn hơn 0';
    if (!product.idBrand) return 'Vui lòng chọn thương hiệu';
    if (!product.idCategory) return 'Vui lòng chọn danh mục';
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }
    
    const formData = new FormData();
    
    // Thêm các trường dữ liệu
    formData.append('nameProduct', product.nameProduct);
    formData.append('priceProduct', product.priceProduct.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('idBrand', product.idBrand);
    formData.append('idCategory', product.idCategory);
    formData.append('status', product.status);
    formData.append('description', product.description);
    
    // Thêm file ảnh nếu có
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    console.log('🔍 Submitting FormData:', {
      nameProduct: product.nameProduct,
      priceProduct: product.priceProduct,
      quantity: product.quantity,
      idBrand: product.idBrand,
      idCategory: product.idCategory,
      status: product.status,
      description: product.description,
      hasImage: !!imageFile
    });
    
    // Debug: Log token
    const token = localStorage.getItem('token');
    console.log('🔍 Token exists:', !!token);
    console.log('🔍 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    
    mutation.mutate(formData);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Thêm Sản phẩm mới</h1>
        <div>
          <Link to="/all-products" className="text-blue-600 hover:underline mr-4">Tất cả Sản phẩm</Link>
          <Link to="/add-new-product" className="text-blue-600 hover:underline">Thêm Sản phẩm mới</Link>
        </div>
      </header>
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {success && <div className="text-green-500 mb-4 font-semibold">{success}</div>}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm Sản phẩm</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tên sản phẩm</label>
            <input
              type="text"
              value={product.nameProduct}
              onChange={(e) => setProduct({ ...product, nameProduct: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Giá sản phẩm</label>
            <input
              type="number"
              value={product.priceProduct}
              onChange={(e) => setProduct({ ...product, priceProduct: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập giá (VND)"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Số lượng</label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) || 0 })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số lượng"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
            )}
          </div>
          <div>
            <label className="block text-gray-700">Thương hiệu</label>
            <select
              value={product.idBrand}
              onChange={(e) => setProduct({ ...product, idBrand: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{isLoadingBrands ? 'Đang tải...' : 'Chọn thương hiệu'}</option>
              {brands.map((brand: any) => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Danh mục</label>
            <select
              value={product.idCategory}
              onChange={(e) => setProduct({ ...product, idCategory: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{isLoadingCategories ? 'Đang tải...' : 'Chọn danh mục'}</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>{cat.nameCategory}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Mô tả</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Mô tả sản phẩm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Đang thêm...' : 'Thêm Sản phẩm'}
          </button>
        </form>
      </div>
      <footer className="text-center text-gray-500 text-sm mt-4">
        © 2023 - pulstron Dashboard
      </footer>
    </div>
  );
};

export default AddNewProduct;