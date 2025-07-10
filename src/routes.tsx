import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Register from './pages/Register';
import Login from './pages/Login';
import AllProducts from './pages/AllProducts';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';
import ProductDetails from './pages/ProductDetails';
import AddNewProduct from './pages/AddNewProduct';
import Notification from './pages/Notification';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/add-new-product" element={<AddNewProduct />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;