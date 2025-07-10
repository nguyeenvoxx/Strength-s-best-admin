import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <aside className="w-64 bg-white p-4 shadow">
      <div className="mb-6">
        <img src="./src/assets/logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
      </div>
      <nav className="space-y-2">
        <Link to="/dashboard" className="w-full text-left p-2 bg-blue-600 text-white rounded flex items-center">
          <span className="mr-2">📊</span> TRANG QUẢN LÝ
        </Link>
        <Link to="/all-products" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">📦</span> TẤT CẢ SẢN PHẨM
        </Link>
        <Link to="/order-list" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">📋</span> DANH SÁCH ĐƠN HÀNG
        </Link>
        <Link to="/orders" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">🛒</span> ĐƠN HÀNG
        </Link>
        <Link to="/users" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">👤</span> NGƯỜI DÙNG
        </Link>
        <Link to="/categories" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">📑</span> DANH MỤC
        </Link>
        <Link to="/reviews" className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center">
          <span className="mr-2">⭐</span> ĐÁNH GIÁ
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;