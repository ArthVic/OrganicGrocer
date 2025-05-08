import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <div className="product-card group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <Link to={`/products/${product.id}`}>
          <div className="product-image-container relative h-48 md:h-56 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.certification === 'Certified Organic' && (
              <div className="absolute top-0 right-0 bg-leaf-600 text-white text-xs px-2 py-1 m-2 rounded-md">
                Organic
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-earth-600">{product.category}</p>
            <h3 className="font-heading font-semibold text-lg mt-1">{product.name}</h3>
            <div className="flex justify-between items-center mt-3">
              <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
              <span className="text-sm text-earth-600">{product.weight}</span>
            </div>
            <Button
              size="sm"
              className="w-full mt-3 bg-leaf-600 hover:bg-leaf-700"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Get category filter from URL if it exists
  const categoryFilter = searchParams.get('category') || '';
  
  // Use our custom hook to fetch products
  const { products, loading, error } = useProducts(categoryFilter);
  
  // Filter options
  const categoryOptions = [
    { name: 'All Categories', value: '' },
    { name: 'Fruits', value: 'fruits' },
    { name: 'Vegetables', value: 'vegetables' },
    { name: 'Berries', value: 'berries' },
    { name: 'Leafy Greens', value: 'leafy-greens' },
  ];
  
  const certificationOptions = [
    { name: 'All Certifications', value: '' },
    { name: 'Certified Organic', value: 'certified-organic' },
  ];
  
  const handleCategoryChange = (value: string) => {
    if (value) {
      searchParams.set('category', value);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };
  
  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">
          Shop Organic Products
        </h1>
        <div className="flex justify-center py-16">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">
          Shop Organic Products
        </h1>
        <div className="text-center py-16">
          <p className="text-red-500">Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900">
            Shop Organic Products
          </h1>
          <p className="text-earth-700 mt-2">
            Browse our selection of fresh, organic produce
          </p>
        </div>
        
        <Button 
          className="md:hidden flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4" />
          Filter Products
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value={option.value}
                      checked={categoryFilter === option.value}
                      onChange={() => handleCategoryChange(option.value)}
                      className="text-leaf-600 focus:ring-leaf-500 h-4 w-4"
                    />
                    <span>{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Certification Filter */}
            <div>
              <h3 className="font-medium mb-2">Certification</h3>
              <div className="space-y-2">
                {certificationOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="certification" 
                      value={option.value}
                      className="rounded text-leaf-600 focus:ring-leaf-500 h-4 w-4"
                    />
                    <span>{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="sr-only">Min Price</label>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="sr-only">Max Price</label>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-leaf-600 hover:bg-leaf-700">
              Apply Filters
            </Button>
          </div>
        </div>
        
        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-lg">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categoryOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        value={option.value}
                        checked={categoryFilter === option.value}
                        onChange={() => {
                          handleCategoryChange(option.value);
                          setShowMobileFilters(false);
                        }}
                        className="text-leaf-600 focus:ring-leaf-500 h-4 w-4"
                      />
                      <span>{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Certification Filter */}
              <div>
                <h3 className="font-medium mb-2">Certification</h3>
                <div className="space-y-2">
                  {certificationOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="certification" 
                        value={option.value}
                        className="rounded text-leaf-600 focus:ring-leaf-500 h-4 w-4"
                      />
                      <span>{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="sr-only">Min Price</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Max Price</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-leaf-600 hover:bg-leaf-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-earth-700">No products match your filters.</p>
                <Button 
                  variant="link" 
                  className="text-leaf-600"
                  onClick={() => {
                    setSearchParams({});
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
