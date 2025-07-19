import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct, updateProduct, getBrands, getCategories } from '../services/api';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  nameProduct: string;
  priceProduct: number;
  quantity: number;
  image: string;
  status: string;
  idBrand?: string;
  idCategory?: string;
  description?: string;
}

interface ProductEdit extends Product {
  idBrand?: string;
  idCategory?: string;
  description?: string;
}

const API_URL = 'http://localhost:3000'; // Sửa lại nếu backend chạy domain khác

const AllProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const { data, isLoading, error: productsError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts(page, 10),
  });
  const products = data?.data?.products || data?.products || [];
  React.useEffect(() => {
    if (data?.results && typeof data.results === 'number' && data.results > 10) {
      setTotalPages(Math.ceil(data.results / 10));
    } else {
      setTotalPages(1);
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const [editingProduct, setEditingProduct] = React.useState<ProductEdit | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
    },
  });
  const [showEditForm, setShowEditForm] = React.useState(false);
  const handleEdit = (product: ProductEdit) => {
    setEditingProduct(product);
    setImagePreview(product.image ? `${API_URL}/uploads/products/${product.image}` : null);
    setShowEditForm(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const validateEditInput = (prod: ProductEdit): string | null => {
    if (!prod.nameProduct.trim()) return 'Tên sản phẩm không được để trống';
    if (prod.priceProduct <= 0) return 'Giá sản phẩm phải lớn hơn 0';
    if (prod.quantity < 1) return 'Số lượng sản phẩm phải lớn hơn 0';
    if (!prod.idBrand) return 'Vui lòng chọn thương hiệu';
    if (!prod.idCategory) return 'Vui lòng chọn danh mục';
    return null;
  };
  const handleSave = () => {
    if (editingProduct) {
      const validationError = validateEditInput(editingProduct);
      if (validationError) {
        setError(validationError);
        setSuccess(null);
        return;
      }
      const { _id, ...dataToUpdate } = editingProduct;
      const formData = new FormData();
      Object.entries(dataToUpdate).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as any);
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }
      updateMutation.mutate({ id: editingProduct._id, data: formData }, {
        onError: (err: any) => {
          setError('Lỗi khi cập nhật sản phẩm: ' + (err?.response?.data?.message || 'Không xác định'));
          setSuccess(null);
        },
        onSuccess: () => {
          setSuccess('Cập nhật sản phẩm thành công!');
          setError(null);
        }
      });
    }
  };
  const handleCancel = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setShowEditForm(false);
  };

  const [showDeletePopup, setShowDeletePopup] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<ProductEdit | null>(null);

  const handleDeleteOrDisable = (product: ProductEdit) => {
    setProductToDelete(product);
    setShowDeletePopup(true);
  };
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete._id);
      setShowDeletePopup(false);
      setProductToDelete(null);
    }
  };
  const handleConfirmDisable = () => {
    if (productToDelete) {
      updateMutation.mutate({ id: productToDelete._id, data: { status: 'inactive' } });
      setShowDeletePopup(false);
      setProductToDelete(null);
    }
  };
  const handleClosePopup = () => {
    setShowDeletePopup(false);
    setProductToDelete(null);
  };

  const defaultImg = '/assets/default-product.png';

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="bg-white p-4 shadow mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tất cả Sản phẩm</h1>
        <Link to="/add-new-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Thêm Sản phẩm mới
        </Link>
      </header>

      {isLoading && <p>Đang tải sản phẩm...</p>}
      {productsError && <p className="text-red-500">Lỗi: {productsError.message}</p>}
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {success && <div className="text-green-500 mb-4 font-semibold">{success}</div>}
      
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={handleCancel} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            <h2 className="text-xl font-bold mb-4 text-gray-700">Chỉnh sửa sản phẩm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
                ) : (
                  <span>img</span>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Tên sản phẩm</label>
                <input name="nameProduct" value={editingProduct.nameProduct} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Giá</label>
                <input name="priceProduct" type="number" value={editingProduct.priceProduct} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Số lượng</label>
                <input name="quantity" type="number" value={editingProduct.quantity} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Trạng thái</label>
                <select name="status" value={editingProduct.status} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="active">Đang bán</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Thương hiệu</label>
                <select name="idBrand" value={editingProduct.idBrand || ''} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Danh mục</label>
                <select name="idCategory" value={editingProduct.idCategory || ''} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="">Chọn danh mục</option>
                  {categories.map((c: any) => <option key={c._id} value={c._id}>{c.nameCategory}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700">Mô tả</label>
                <textarea name="description" value={editingProduct.description || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Lưu</button>
              <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-center">Ảnh</th>
                <th className="py-2 px-4 border-b text-center">Tên sản phẩm</th>
                <th className="py-2 px-4 border-b text-center">Giá</th>
                <th className="py-2 px-4 border-b text-center">Số lượng</th>
                <th className="py-2 px-4 border-b text-center">Trạng thái</th>
                <th className="py-2 px-4 border-b text-center">Thương hiệu</th>
                <th className="py-2 px-4 border-b text-center">Danh mục</th>
                <th className="py-2 px-4 border-b text-center">Mô tả</th>
                <th className="py-2 px-4 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      src={product.image ? `${API_URL}/uploads/products/${product.image}` : defaultImg}
                      alt={product.nameProduct}
                      className="w-12 h-12 object-cover rounded border mx-auto"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.append('img'); }}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">{product.nameProduct}</td>
                  <td className="py-2 px-4 border-b text-center">{product.priceProduct.toLocaleString('vi-VN')} VND</td>
                  <td className="py-2 px-4 border-b text-center">{product.quantity}</td>
                  <td className="py-2 px-4 border-b text-center">{product.status === 'active' ? 'Đang bán' : 'Vô hiệu hóa'}</td>
                  <td className="py-2 px-4 border-b text-center">{brands.find((b: any) => b._id === product.idBrand)?.name || '-'}</td>
                  <td className="py-2 px-4 border-b text-center">{categories.find((c: any) => c._id === product.idCategory)?.nameCategory || '-'}</td>
                  <td className="py-2 px-4 border-b text-center max-w-xs truncate" title={product.description}>{product.description}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition mr-2"
                    >
                      Sửa
                    </button>
                    {product.status === 'inactive' ? (
                      <button
                        onClick={() => updateMutation.mutate({ id: product._id, data: { status: 'active' } })}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        disabled={updateMutation.isPending}
                      >
                        Kích hoạt lại
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteOrDisable(product)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        disabled={deleteMutation.isPending}
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&laquo;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border bg-gray-100 disabled:opacity-50">&raquo;</button>
        </div>
      )}
      {showDeletePopup && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Xác nhận xóa sản phẩm</h3>
            <p className="mb-4 text-gray-700">Bạn có chắc chắn muốn xóa sản phẩm <span className="font-semibold">{productToDelete.nameProduct}</span> không? Sản phẩm vẫn còn hàng.</p>
            <div className="flex justify-end gap-2">
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Xóa</button>
              <button onClick={handleConfirmDisable} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Vô hiệu hóa</button>
              <button onClick={handleClosePopup} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;