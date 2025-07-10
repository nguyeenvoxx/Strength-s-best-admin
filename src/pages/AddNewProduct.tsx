import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ProductInput {
  nameProduct: string;
  priceProduct: number;
  quantity: number;
}

const AddNewProduct: React.FC = () => {
  const [product, setProduct] = useState<ProductInput>({ nameProduct: '', priceProduct: 0, quantity: 0 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateInput = (): string | null => {
    if (!product.nameProduct.trim()) return 'Tên sản phẩm không được để trống';
    if (product.priceProduct <= 0) return 'Giá sản phẩm phải lớn hơn 0';
    if (product.quantity < 0) return 'Số lượng không được âm';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post('/api/v1/products', product, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.status === 'thành công') {
        setSuccess('Thêm sản phẩm thành công!');
        setProduct({ nameProduct: '', priceProduct: 0, quantity: 0 });
        setError(null);
      } else {
        setError('Thêm sản phẩm thất bại');
      }
    } catch (err) {
      setError('Lỗi khi thêm sản phẩm: ' + (err as Error).message);
      console.error('Error adding product:', err);
    }
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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Thêm Sản phẩm
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