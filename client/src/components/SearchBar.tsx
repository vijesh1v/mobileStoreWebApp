import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync search term with URL params if on products page
  useEffect(() => {
    if (location.pathname === '/products') {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      } else {
        setSearchTerm('');
      }
    } else {
      setSearchTerm('');
    }
  }, [location]);

  // Real-time search with debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to update URL after 300ms of no typing
    debounceTimer.current = setTimeout(() => {
      const currentPath = location.pathname;
      const currentParams = new URLSearchParams(location.search);
      const currentSearchParam = currentParams.get('search');
      const trimmedSearch = searchTerm.trim();
      
      // Only update if search term actually changed
      if (currentSearchParam !== trimmedSearch) {
        // If we're on products page, update search param
        if (currentPath === '/products') {
          if (trimmedSearch) {
            currentParams.set('search', trimmedSearch);
          } else {
            currentParams.delete('search');
          }
          navigate(`/products?${currentParams.toString()}`, { replace: true });
        } else if (trimmedSearch) {
          // If not on products page but user is typing, navigate to products with search
          navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
        }
      }
    }, 300);

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, navigate, location.pathname, location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search items
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

