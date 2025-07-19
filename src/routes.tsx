import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Login from './pages/Login';
import AllProducts from './pages/AllProducts';
import AddNewProduct from './pages/AddNewProduct';
import Categories from './pages/Categories';
import Reviews from './pages/Reviews';
import Brands from './pages/Brands';
import Voucher from './pages/Voucher';
import News from './pages/News';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/add-new-product" element={<AddNewProduct />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/vouchers" element={<Voucher />} />
        <Route path="/news" element={<News />} />
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;