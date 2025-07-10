import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  nameProduct: string;
  priceProduct: number;
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.status === 'thành công' && Array.isArray(response.data.data.products)) {
          setProducts(response.data.data.products);
        } else {
          setError('Dữ liệu không hợp lệ từ API');
        }
      } catch (err) {
        setError('Lỗi khi lấy danh sách sản phẩm: ' + (err as Error).message);
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tất cả Sản phẩm</h1>
        <div>
          <Link to="/all-products" className="text-blue-600 hover:underline mr-4">Tất cả Sản phẩm</Link>
          <Link to="/add-new-product" className="text-blue-600 hover:underline">Thêm Sản phẩm mới</Link>
        </div>
      </header>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Tên sản phẩm</th>
                <th className="border p-2 text-left">Giá</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="border p-2">{product.nameProduct}</td>
                  <td className="border p-2">{product.priceProduct} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="text-center text-gray-500 text-sm mt-4">
        © 2023 - pulstron Dashboard
      </footer>
    </div>
  );
};

export default AllProducts;