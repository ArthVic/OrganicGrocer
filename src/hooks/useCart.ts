
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/contexts/CartContext';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartData>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems, totalPrice };
  };

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First get the user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (cartError) {
        if (cartError.code === 'PGRST116') {
          // No cart found, create one
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();
          
          if (createError) throw createError;
          
          setCart({ items: [], totalItems: 0, totalPrice: 0 });
          setLoading(false);
          return;
        }
        throw cartError;
      }

      // Now get the cart items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products:product_id (
            id,
            name,
            price,
            image,
            category,
            certification,
            description,
            nutrition_info,
            weight
          )
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) throw itemsError;

      // Format the data to match our CartItem structure
      const formattedItems = itemsData.map((item: any): CartItem => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.image,
          category: item.products.category,
          certification: item.products.certification,
          description: item.products.description,
          nutritionInfo: item.products.nutrition_info,
          weight: item.products.weight
        }
      }));

      const { totalItems, totalPrice } = calculateTotals(formattedItems);
      setCart({ items: formattedItems, totalItems, totalPrice });
    } catch (err: any) {
      toast.error(`Error fetching cart: ${err.message}`);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();

    if (user) {
      // Set up realtime subscription for cart items
      const channel = supabase
        .channel('cart-items-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'cart_items' }, 
          () => {
            fetchCart();
          })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchCart]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    try {
      // Get the user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cartError) throw cartError;

      // Check if the item already exists in cart
      const { data: existingItem, error: queryError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartData.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (queryError) throw queryError;

      if (existingItem) {
        // Update existing item
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartData.id,
            product_id: product.id,
            quantity: quantity
          });

        if (insertError) throw insertError;
      }

      toast.success(`${product.name} added to cart!`);
      // Cart will update automatically via the realtime subscription
    } catch (err: any) {
      toast.error(`Error adding to cart: ${err.message}`);
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      // Cart will update automatically via the realtime subscription
    } catch (err: any) {
      toast.error(`Error removing from cart: ${err.message}`);
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      
      // Cart will update automatically via the realtime subscription
    } catch (err: any) {
      toast.error(`Error updating quantity: ${err.message}`);
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      // Get the user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cartError) throw cartError;

      // Delete all items in the cart
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartData.id);

      if (error) throw error;
      
      // Cart will update automatically via the realtime subscription
    } catch (err: any) {
      toast.error(`Error clearing cart: ${err.message}`);
      console.error('Error clearing cart:', err);
    }
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
