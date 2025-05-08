
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate('/auth');
      return;
    }
    
    toast.success("Proceeding to checkout!");
    navigate('/checkout');
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.info(`${name} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Cart cleared");
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">Your Cart</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-leaf-50 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-leaf-600" />
          </div>
          <h2 className="font-heading text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-earth-700 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-leaf-600 hover:bg-leaf-700">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-heading font-semibold text-xl">
                  Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              <ul>
                {cart.items.map((item) => (
                  <li key={item.id} className="p-4 md:p-6 border-b last:border-b-0 flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-sm text-earth-600">{item.product.weight}</p>
                        </div>
                        <div className="text-lg font-semibold md:text-right mt-2 md:mt-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-y border-gray-300">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemoveItem(item.id, item.product.name)}
                          className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-earth-700">Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-700">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-700">Tax</span>
                  <span>${(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full bg-leaf-600 hover:bg-leaf-700"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <div className="mt-6">
                <Button 
                  asChild
                  variant="outline"
                  className="w-full border-leaf-600 text-leaf-600 hover:bg-leaf-50"
                >
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
