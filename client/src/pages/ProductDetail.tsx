import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  image_url: string;
  description: string;
  stock: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={product.image_url || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {product.brand} • {product.model}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">Storage:</span>
                  <span className="text-gray-600">{product.storage}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">Color:</span>
                  <span className="text-gray-600">{product.color}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">Stock:</span>
                  <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

