import React, { useState, useRef, useEffect } from 'react';
import searchIcon from '../assets/Search1.png';
import { searchAll } from '../services/api';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);
    try {
      const data = await searchAll(searchQuery.trim());
      setSearchResults(data);
    } catch (err) {
      setSearchError('Lỗi khi tìm kiếm');
    }
    setSearchLoading(false);
    setIsSearchOpen(true);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  const handleSearchBlur = (e: React.FocusEvent) => {
    // Nếu blur ra ngoài dropdown kết quả thì vẫn đóng
    setTimeout(() => setIsSearchOpen(false), 150);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsSearchOpen(false);
  };

  return (
    <header className="bg-white p-4 shadow flex justify-between items-center relative">
      <div className="flex items-center space-x-4">
        {/* Logo đã chuyển sang Sidebar */}
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={handleSearchIconClick}
        >
          <img src={searchIcon} alt="Tìm kiếm" className="w-5 h-5" />
        </button>
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="relative" style={{ minWidth: 260 }}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 transition"
              placeholder="Tìm kiếm đơn hàng, người dùng, sản phẩm..."
              onBlur={handleSearchBlur}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="hidden">Tìm kiếm</button>
            {(searchQuery.trim() || searchLoading || searchResults) && (
              <div className="absolute left-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-2 z-20">
                {searchLoading && <div>Đang tìm kiếm...</div>}
                {searchError && <div className="text-red-500">{searchError}</div>}
                {searchResults && (
                  <div className="max-h-64 overflow-y-auto">
                    <div className="font-bold text-gray-700 mt-2">Đơn hàng</div>
                    {searchResults.orders.length === 0 ? <div className="text-xs text-gray-400">Không có kết quả</div> :
                      searchResults.orders.map((order: any) => (
                        <div key={order._id} className="p-2 border-b text-sm">
                          <b>Mã:</b> {order._id} | <b>Khách:</b> {order.idUser?.name} | <b>Trạng thái:</b> {order.status}
                        </div>
                      ))}
                    <div className="font-bold text-gray-700 mt-2">Người dùng</div>
                    {searchResults.users.length === 0 ? <div className="text-xs text-gray-400">Không có kết quả</div> :
                      searchResults.users.map((user: any) => (
                        <div key={user._id} className="p-2 border-b text-sm">
                          <b>Tên:</b> {user.name} | <b>Email:</b> {user.email}
                        </div>
                      ))}
                    <div className="font-bold text-gray-700 mt-2">Sản phẩm</div>
                    {searchResults.products.length === 0 ? <div className="text-xs text-gray-400">Không có kết quả</div> :
                      searchResults.products.map((prod: any) => (
                        <div key={prod._id} className="p-2 border-b text-sm">
                          <b>{prod.nameProduct}</b> | <span>{prod.description}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </form>
        )}
      </div>
      <div className="flex items-center space-x-4 relative">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center">
          ADMIN 
        </button>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;