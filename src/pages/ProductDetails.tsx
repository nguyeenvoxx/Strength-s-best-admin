import React, { useState } from 'react';

const ProductDetails: React.FC = () => {
  const [productName, setProductName] = useState('Lorem Ipsum');
  const [description, setDescription] = useState('Lorem ipsum is A Dummy Text');
  const [category, setCategory] = useState('Sneaker');
  const [brand, setBrand] = useState('Adidas');
  const [sku, setSku] = useState('#2A53');
  const [stockQuantity, setStockQuantity] = useState('211');
  const [regularPrice, setRegularPrice] = useState('₹110.40');
  const [salePrice, setSalePrice] = useState('₹50');
  const [tags, setTags] = useState(['Lorem']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product updated!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <p className="text-sm text-gray-500 mb-4">Home / All Products / Product Details</p>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input
                type="text"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Regular Price</label>
              <input
                type="text"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price</label>
              <input
                type="text"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <label className="block text-sm font-medium mb-1 mt-2">Tag</label>
          <div className="flex space-x-2">
            {tags.map((tag, index) => (
              <button key={index} className="bg-gray-200 text-black px-2 py-1 rounded">{tag}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="w-64 h-64 bg-gray-300 rounded mb-2"></div>
          <div className="border-dashed border-2 p-2 mb-2">
            <p className="text-sm text-gray-500">Drop your image here, or browse</p>
            <p className="text-sm text-gray-500">Jpeg, png are allowed</p>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded mr-2"></div>
                <input type="text" value={`Product thumbnail${index}.png`} className="flex-1 p-2 border rounded" />
                <button className="ml-2 text-blue-500">✔</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">UPDATE</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded">DELETE</button>
            <button className="bg-gray-300 px-4 py-2 rounded">CANCEL</button>
          </div>
        </div>
      </form>
     
    </div>
  );
};

export default ProductDetails;