import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white p-4 shadow">
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-16 h-16 mx-auto" />
      </div>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">📊</span> TRANG QUẢN LÝ
        </NavLink>
        <NavLink to="/all-products" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">📦</span> TẤT CẢ SẢN PHẨM
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">🛒</span> ĐƠN HÀNG
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">👤</span> NGƯỜI DÙNG
        </NavLink>
        <NavLink to="/brands" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">🏷️</span> THƯƠNG HIỆU
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">📑</span> DANH MỤC
        </NavLink>
        <NavLink to="/reviews" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">⭐</span> ĐÁNH GIÁ
        </NavLink>
        <NavLink to="/vouchers" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">🎟️</span> MÃ GIẢM GIÁ
        </NavLink>
        <NavLink to="/news" className={({ isActive }) => `w-full text-left p-2 rounded flex items-center ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}>
          <span className="mr-2">📰</span> TIN TỨC
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;