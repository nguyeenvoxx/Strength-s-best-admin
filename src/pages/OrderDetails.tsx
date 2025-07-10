import React, { useState } from 'react';

const OrderDetails: React.FC = () => {
  const [status, setStatus] = useState('Pending');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleSave = () => {
    alert(`Order status updated to ${status}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Details</h1>
      <p className="text-sm text-gray-500 mb-4">Home / Order List / Order Details</p>
      <div className="bg-white p-4 rounded shadow grid grid-cols-2 gap-4">
        <div>
          <p>Orders ID: #6743 <span className="text-yellow-500">{status}</span></p>
          <p>Feb 16, 2022 - Feb 20, 2022</p>
          <div className="flex space-x-2 mt-2">
            <div className="bg-gray-200 p-2 rounded">
              <p>Customer</p>
              <p>Full Name: Shristi Singh</p>
              <p>Email: shristi@gmail.com</p>
              <p>Phone: +91 904 231 1212</p>
              <button className="text-blue-500 mt-2">View profile</button>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p>Order Info</p>
              <p>Shipping: Next express</p>
              <p>Payment Method: Paypal</p>
              <p>Status: {status}</p>
              <button className="text-blue-500 mt-2">Download info</button>
            </div>
            <div className="bg-gray-200 p-2 rounded">
              <p>Deliver to</p>
              <p>Address: Dharam Colony, Palam Vihar, Gurgaon, Haryana</p>
              <button className="text-blue-500 mt-2">View profile</button>
            </div>
          </div>
          <div className="mt-4">
            <p>Payment Info</p>
            <p>Master Card **** **** **** 6557</p>
            <p>Business name: Shristi Singh</p>
            <p>Phone: +91 904 231 1212</p>
          </div>
          <div className="mt-4">
            <p>Note</p>
            <textarea className="w-full p-2 border rounded" placeholder="Type some notes"></textarea>
          </div>
        </div>
        <div>
          <div className="flex justify-end mb-2">
            <select value={status} onChange={handleStatusChange} className="border p-2 rounded">
              <option>Pending</option>
              <option>Delivered</option>
              <option>Canceled</option>
            </select>
            <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 ml-2 rounded">Save</button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product Name</th>
                <th className="border p-2 text-left">Order ID</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">
                  <input type="checkbox" className="mr-2" />
                  Lorem Ipsum
                </td>
                <td className="border p-2">#25241</td>
                <td className="border p-2">2</td>
                <td className="border p-2">₹800.40</td>
              </tr>
              <tr>
                <td className="border p-2">
                  <input type="checkbox" className="mr-2" />
                  Lorem Ipsum
                </td>
                <td className="border p-2">#25241</td>
                <td className="border p-2">2</td>
                <td className="border p-2">₹800.40</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <p>Subtotal: ₹3,201.6</p>
            <p>Tax (20%): ₹640.32</p>
            <p>Discount: ₹0</p>
            <p>Shipping Rate: ₹0</p>
            <p>Total: ₹3,841.92</p>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default OrderDetails;