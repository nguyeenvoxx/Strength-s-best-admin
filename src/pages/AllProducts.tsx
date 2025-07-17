import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../services/api';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  nameProduct: string;
  priceProduct: number;
  quantity: number;
  image: string;
  status: string;
}

const AllProducts: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tất cả Sản phẩm</h1>
        <Link to="/add-new-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Thêm Sản phẩm mới
        </Link>
      </header>

      {isLoading && <p>Đang tải sản phẩm...</p>}
      {error && <p className="text-red-500">Lỗi: {error.message}</p>}
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Ảnh</th>
                <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                <th className="py-2 px-4 border-b">Giá</th>
                <th className="py-2 px-4 border-b">Số lượng</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border-b">
                    <img src={`/assets/${product.image}`} alt={product.nameProduct} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-2 px-4 border-b">{product.nameProduct}</td>
                  <td className="py-2 px-4 border-b">{product.priceProduct.toLocaleString('vi-VN')} VND</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">{product.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:underline"
                      disabled={deleteMutation.isPending}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;