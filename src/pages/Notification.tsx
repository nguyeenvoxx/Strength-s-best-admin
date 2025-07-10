import React from 'react';

interface Notification {
  id: string;
  message: string;
  date: string;
  amount: number;
}

const Notification: React.FC = () => {
  const mockNotifications: Notification[] = [
    { id: '1', message: 'Lorem Ipsum', date: 'Nov 11, 2022', amount: 140 },
    { id: '2', message: 'Lorem Ipsum 02', date: 'Nov 10, 2022', amount: 140 },
    { id: '3', message: 'Lorem Ipsum', date: 'Nov 15, 2022', amount: 140 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">Dashboard</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-bold mb-2">Sale Graph</h3>
          <div className="bg-gray-100 p-4 rounded">
            <canvas className="w-full h-48"></canvas>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="bg-gray-300 px-2 py-1 rounded">WEEKLY</button>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">MONTHLY</button>
              <button className="bg-gray-300 px-2 py-1 rounded">YEARLY</button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Notifications</h3>
          <div className="bg-gray-100 p-4 rounded">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className="flex justify-between items-center mb-2">
                <span>{notif.message}</span>
                <span className="text-green-700">₹{notif.amount}</span>
                <span className="text-gray-500">{notif.date}</span>
              </div>
            ))}
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
              VIEW ALL NOTIFICATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;