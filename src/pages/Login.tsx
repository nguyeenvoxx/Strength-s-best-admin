import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Bạn cần đồng ý với điều khoản để đăng nhập.");
      return;
    }
    if (email && password) {
      setLoading(true);
      try {
        const data = await login({ email, password });
        if (data.data.user.role !== 'admin') {
          alert('Chỉ tài khoản admin mới được phép đăng nhập vào trang quản trị!');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.data.user._id);
        navigate('/');
      } catch (error: any) {
        alert(error?.response?.data?.message || 'Đăng nhập thất bại.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <div className="w-full max-w-md flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-48 h-48 object-contain mb-6 mt-2" />
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <div>
            <input
              type="email"
              placeholder="Email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded px-4 py-3 text-base focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 rounded px-4 py-3 text-base focus:outline-none focus:border-green-500 pr-12"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                className="mr-2 accent-green-600"
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-gray-500 hover:underline">Quên mật khẩu?</a>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition uppercase tracking-wide text-base"
            disabled={loading || !agree}
          >
            {loading ? 'Đang đăng nhập...' : (<><span>ĐĂNG NHẬP</span> <FiArrowRight size={20} /></>)}
          </button>
          <div className="flex items-start text-sm mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mr-2 accent-green-600 mt-1 cursor-pointer"
            />
            <span>
              Bằng việc nhấn 'Đăng nhập' bạn đã đồng ý với <a href="#" className="underline font-medium">Điều khoản & Chính sách</a> của chúng tôi.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;