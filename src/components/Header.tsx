import React, { useState } from 'react';
import searchIcon from '../assets/Search1.png';
import notiIcon from '../assets/noti.png';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, message: 'Lorem ipsum', amount: '₹140', date: 'Nov 11, 2022', status: 'Sold' },
    { id: 2, message: 'Lorem ipsum', amount: '₹140', date: 'Nov 15, 2022', status: 'Sold', increase: '↑ 34.7%' },
    { id: 3, message: 'Lorem ipsum', amount: '₹140', date: 'Nov 15, 2022', status: 'Sold' },
    { id: 4, message: 'Lorem ipsum', amount: '₹140', date: 'Nov 14, 2022', status: 'Sold' },
    // Thêm các mục khác nếu cần, nhưng chỉ hiển thị 4
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-white p-4 shadow flex justify-between items-center relative">
      <div className="flex items-center space-x-4">
        {/* Logo đã chuyển sang Sidebar */}
      </div>
      <div className="flex items-center space-x-4 relative">
        <button
          className="text-gray-600 focus:outline-none"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <img src={searchIcon} alt="Tìm kiếm" className="w-5 h-5 mx-auto" />
        </button>
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-1 border rounded"
              placeholder="Search..."
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        )}
        <button
          className="text-gray-600 focus:outline-none"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <img src={notiIcon} alt="Thông báo" className="w-5 h-5 mx-auto" />
        </button>
        {isNotificationOpen && (
          <div className="absolute right-0 mt-8 w-64 bg-white shadow-lg rounded-lg p-4 z-10" style={{ top: '100%' }}>
            <h3 className="text-lg font-bold mb-4">Notifications</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <div>
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{notif.amount}</p>
                    <p className="text-xs text-blue-500">{notif.status} {notif.increase}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button className="text-blue-500 text-sm">MARK ALL AS READ</button>
              <button className="text-blue-500 text-sm">VIEW ALL NOTIFICATION</button>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="mt-4 w-full bg-gray-200 text-black p-1 rounded"
            >
              Close
            </button>
          </div>
        )}
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