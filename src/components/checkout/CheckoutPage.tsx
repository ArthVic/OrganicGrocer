
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Check, CreditCard, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { profile, loading: profileLoading } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formStep, setFormStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  // Pre-populate form with profile data when it loads
  useEffect(() => {
    if (profile) {
      setShippingDetails({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zip_code || '',
        country: profile.country || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [id]: value }));
  };

  const stepTitles = ["Shipping", "Payment", "Review"];

  // Redirect to cart if empty or not logged in
  useEffect(() => {
    if (!cartLoading && cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
    
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
    }
  }, [cart.items.length, cartLoading, user, navigate]);

  const handleNextStep = () => {
    if (formStep < 2) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Here you would save the order to your database in a real application
      
      // Simulate order processing delay
      toast.info("Processing your order...");
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success("Order placed successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Error placing order. Please try again.");
      console.error("Order error:", error);
    }
  };

  if (cartLoading || profileLoading) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">Checkout</h1>
        <div className="text-center py-16">
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {stepTitles.map((title, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= formStep ? 'bg-leaf-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {index < formStep ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <span className="mt-2 text-sm">{title}</span>
            {index < stepTitles.length - 1 && (
              <div className={`hidden sm:block h-1 w-full ${index < formStep ? 'bg-leaf-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Shipping Address Form */}
          {formStep === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Shipping Address</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                    <Input 
                      id="firstName" 
                      value={shippingDetails.firstName} 
                      onChange={handleChange} 
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                    <Input 
                      id="lastName" 
                      value={shippingDetails.lastName} 
                      onChange={handleChange} 
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address</label>
                  <Input 
                    id="address" 
                    value={shippingDetails.address} 
                    onChange={handleChange} 
                    placeholder="123 Organic Lane"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                    <Input 
                      id="city" 
                      value={shippingDetails.city} 
                      onChange={handleChange} 
                      placeholder="Fresh Meadows"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                    <Input 
                      id="state" 
                      value={shippingDetails.state} 
                      onChange={handleChange} 
                      placeholder="California"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP Code</label>
                    <Input 
                      id="zipCode" 
                      value={shippingDetails.zipCode} 
                      onChange={handleChange} 
                      placeholder="90210"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                    <Input 
                      id="country" 
                      value={shippingDetails.country} 
                      onChange={handleChange} 
                      placeholder="United States"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input 
                    id="phone" 
                    value={shippingDetails.phone} 
                    onChange={handleChange} 
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </form>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNextStep} className="bg-leaf-600 hover:bg-leaf-700">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {formStep === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="mb-6">
                <RadioGroup 
                  defaultValue="card" 
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="card" id="payment-card" />
                    <label htmlFor="payment-card" className="flex items-center cursor-pointer w-full">
                      <CreditCard className="h-5 w-5 mr-2 text-leaf-600" />
                      <span>Credit / Debit Card</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="paypal" id="payment-paypal" />
                    <label htmlFor="payment-paypal" className="flex items-center cursor-pointer w-full">
                      <span className="font-bold text-blue-800 mr-2">Pay</span>
                      <span className="font-bold text-blue-500">Pal</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                    <Input id="cardName" placeholder={`${shippingDetails.firstName} ${shippingDetails.lastName}`} />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                    <Input id="cardNumber" placeholder="**** **** **** ****" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                      <Input id="cvv" placeholder="***" />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="border rounded-md p-4 bg-gray-50 text-center">
                  <p>Click 'Continue to Review' to be redirected to PayPal for payment.</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                >
                  Back to Shipping
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="bg-leaf-600 hover:bg-leaf-700"
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          )}

          {/* Order Review */}
          {formStep === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Review Your Order</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Shipping Information</h3>
                  <p className="text-earth-700">
                    {shippingDetails.firstName} {shippingDetails.lastName}<br />
                    {shippingDetails.address}<br />
                    {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}<br />
                    {shippingDetails.country}<br />
                    {shippingDetails.phone}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Payment Method</h3>
                  <div className="flex items-center">
                    {paymentMethod === 'card' ? (
                      <>
                        <CreditCard className="h-5 w-5 mr-2 text-leaf-600" />
                        <span>Credit Card ending in ****</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-blue-800 mr-1">Pay</span>
                        <span className="font-bold text-blue-500">Pal</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Order Items</h3>
                  <ul className="space-y-2">
                    {cart.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{item.product.name} × {item.quantity}</span>
                        </div>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Delivery</h3>
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-leaf-600" />
                    <div>
                      <p className="font-medium">Standard Delivery</p>
                      <p className="text-sm text-earth-600">Delivery within 2-4 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                >
                  Back to Payment
                </Button>
                <Button 
                  onClick={handlePlaceOrder}
                  className="bg-leaf-600 hover:bg-leaf-700"
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
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
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
