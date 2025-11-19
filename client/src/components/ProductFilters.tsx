import { useState, useEffect } from 'react';

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

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableBrands: string[];
  availableStorages: string[];
  availableColors: string[];
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  availableBrands,
  availableStorages,
  availableColors,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = localFilters.platform || [];
    let newPlatforms: string[];

    if (checked) {
      newPlatforms = [...currentPlatforms, platform];
    } else {
      newPlatforms = currentPlatforms.filter(p => p !== platform);
    }

    const newFilters = { ...localFilters, platform: newPlatforms };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters); // Platform changes are immediate, no debounce needed
  };

  const removePlatform = (platform: string) => {
    const currentPlatforms = localFilters.platform || [];
    const newPlatforms = currentPlatforms.filter(p => p !== platform);
    const newFilters = { ...localFilters, platform: newPlatforms };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      brand: '',
      minPrice: '',
      maxPrice: '',
      storage: '',
      color: '',
      platform: [],
      sort: 'name',
      order: 'ASC',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Platform Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={(localFilters.platform || []).includes('iPhone')}
              onChange={(e) => handlePlatformChange('iPhone', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">iPhone</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={(localFilters.platform || []).includes('Android')}
              onChange={(e) => handlePlatformChange('Android', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Android</span>
          </label>
        </div>
        
        {/* Selected Platforms Display */}
        {(localFilters.platform || []).length > 0 && (
          <div className="mt-3 space-y-2">
            {(localFilters.platform || []).map((platform) => (
              <div
                key={platform}
                className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md"
              >
                <span className="text-sm font-medium text-blue-900">{platform}</span>
                <button
                  onClick={() => removePlatform(platform)}
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  aria-label={`Remove ${platform} filter`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <select
          value={localFilters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Brands</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Storage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Storage
        </label>
        <select
          value={localFilters.storage}
          onChange={(e) => handleChange('storage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Storage</option>
          {availableStorages.map((storage) => (
            <option key={storage} value={storage}>
              {storage}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <select
          value={localFilters.color}
          onChange={(e) => handleChange('color', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Colors</option>
          {availableColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={`${localFilters.sort}-${localFilters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            handleChange('sort', sort);
            handleChange('order', order);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name-ASC">Name (A-Z)</option>
          <option value="name-DESC">Name (Z-A)</option>
          <option value="price-ASC">Price (Low to High)</option>
          <option value="price-DESC">Price (High to Low)</option>
        </select>
      </div>
    </div>
  );
}

