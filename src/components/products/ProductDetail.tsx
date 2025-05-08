
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSingleProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const { product, loading, error } = useSingleProduct(id);
  
  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-16">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">Product Not Found</h2>
        <p className="text-earth-700 mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button 
          onClick={() => navigate('/products')}
          className="bg-leaf-600 hover:bg-leaf-700"
        >
          Back to Products
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="inline-flex items-center text-earth-600"
          onClick={() => navigate('/products')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover aspect-square"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-2">
            <span className="text-sm text-earth-600">{product.category}</span>
            {product.certification === 'Certified Organic' && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-leaf-100 text-leaf-800">
                <Check className="h-3 w-3 mr-1" />
                Organic
              </span>
            )}
          </div>
          
          <h1 className="font-heading text-3xl font-bold text-earth-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold">${product.price?.toFixed(2)}</span>
            <span className="ml-2 text-sm text-earth-600">/ {product.weight}</span>
          </div>
          
          <p className="text-earth-700 mb-6">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full mb-6 bg-leaf-600 hover:bg-leaf-700 h-12 relative overflow-hidden"
            disabled={isAdding}
            onClick={handleAddToCart}
          >
            <span className={`flex items-center justify-center transition-all duration-300 ${isAdding ? 'translate-y-full opacity-0' : ''}`}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
              <Check className="h-5 w-5 mr-2" />
              Added to Cart!
            </span>
          </Button>
          
          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-heading font-semibold text-lg mb-2">Product Details</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="font-medium min-w-32">Weight:</span>
                <span>{product.weight}</span>
              </li>
              <li className="flex">
                <span className="font-medium min-w-32">Category:</span>
                <span>{product.category}</span>
              </li>
              <li className="flex">
                <span className="font-medium min-w-32">Certification:</span>
                <span>{product.certification || 'None'}</span>
              </li>
            </ul>
          </div>
          
          {/* Nutrition Info */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-heading font-semibold text-lg mb-2">Nutrition Information</h3>
            <p className="text-earth-700">{product.nutritionInfo || 'No nutrition information available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
