import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('token', 'fake-token');
      navigate('/');
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('token', 'fake-token');
      alert('Đăng ký thành công! Vui lòng đăng nhập..');
      setIsRegister(false);
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-center p-6 bg-white">
          <img src="./src/assets/logo.png" alt="Logo" className="w-64 h-64 object-contain" />
        </div>
        <div className="p-6 flex flex-col justify-center w-full">

          {isRegister ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-left">ĐĂNG KÝ</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên</label>
                  <input type="text" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Họ</label>
                  <input type="text" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Nhâp mật khẩu của bạn"
                    required
                  />
                  <div>
                    <p className="text-sm">
                      <span className="text-red-500">* </span>Tối thiểu 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-sm">Khi đăng nhập, bạn đồng ý với Điều khoản & Điều kiện của chúng tôi.</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-sm">Duy trì đăng nhập</label>
                </div>
                <button type="submit" className="w-full bg-blue-950 text-white p-2 rounded">ĐĂNG KÝ</button>
                <p className="text-center mt-4">
                  Bạn đã có tài khoản?{' '}
                  <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(false)}>Đăng nhập</span>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-start">ĐĂNG NHẬP</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder='Nhâp email của bạn'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Nhâp mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-sm">Duy trì đăng nhập </label>

                </div>
                {/* <p className="text-right mb-4">Forgot your password?</p> */}
                <button type="submit" className="w-full bg-blue-950 text-white p-2 rounded">ĐĂNG NHẬP</button>
              </form>
              <div className="flex justify-center space-x-4 mt-4">
                <button className="w-40 h-14 flex items-center justify-center border border-gray-300 rounded-lg hover:shadow-md transiton"><img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" /></button>
                <button className="w-40 h-14 flex items-center justify-center border border-gray-300 rounded-lg hover:shadow-md transiton"><img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-6 h-6" /></button>
                <button className="w-40 h-14 flex items-center justify-center border border-gray-300 rounded-lg hover:shadow-md transiton"><img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-6 h-6" /></button>
              </div>
              <p className="text-center mt-4">
                Bằng cách nhấp vào 'Đăng nhập', bạn đồng ý với Điều khoản & Điều kiện của trang web của chúng tôi.
              </p>
              <p className="text-center mt-4">
               Bạn chưa có tài khoản?{' '}
                <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(true)}>Đăng ký</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;