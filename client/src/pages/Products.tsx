import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductFilters from '../components/ProductFilters';
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

interface Filters {
  brand: string;
  minPrice: string;
  maxPrice: string;
  storage: string;
  color: string;
  platform: string[];
  sort: string;
  order: string;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    brand: '',
    minPrice: '',
    maxPrice: '',
    storage: '',
    color: '',
    platform: [],
    sort: 'name',
    order: 'ASC',
  });
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableStorages, setAvailableStorages] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Initialize search from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    // Search is handled separately via URL, not in filters
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.storage) params.append('storage', filters.storage);
      if (filters.color) params.append('color', filters.color);
      
      // Handle platform filter (iPhone = Apple brand, Android = non-Apple brands)
      if (filters.platform && filters.platform.length > 0) {
        filters.platform.forEach(platform => {
          params.append('platform', platform);
        });
      }
      
      // Handle search from URL params
      const searchParam = searchParams.get('search');
      if (searchParam) {
        params.append('search', searchParam);
      }
      
      params.append('sort', filters.sort);
      params.append('order', filters.order);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setAvailableBrands(response.data.filters.brands);
      setAvailableStorages(response.data.filters.storages);
      setAvailableColors(response.data.filters.colors);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableBrands={availableBrands}
              availableStorages={availableStorages}
              availableColors={availableColors}
            />
          </div>

          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image_url || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.brand} • {product.storage} • {product.color}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

