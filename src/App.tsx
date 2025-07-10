import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AllProducts from './pages/AllProducts';

import OrderList from './pages/OrderList';
import AddNewProduct from './pages//AddNewProduct';
import LoginNotification from './pages/Notification';
import Orders from './pages/Orders';
import Notification from './pages/Notification';
import OrderDetails from './pages/OrderDetails';
import ProductDetails from './pages/ProductDetails';
import Register from './pages/Register';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Reviews from './pages/Reviews';

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/add-new-product" element={<AddNewProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/reviews" element={<Reviews />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;