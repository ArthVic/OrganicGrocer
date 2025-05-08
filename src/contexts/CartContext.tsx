
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  certification: string;
  description: string;
  nutritionInfo: string;
  weight: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Context and Provider
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (totals, item) => ({
      totalItems: totals.totalItems + item.quantity,
      totalPrice: totals.totalPrice + item.product.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, { product, quantity }];
      }

      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload.id);
      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }

      const updatedItems = state.items.map(item =>
        item.product.id === id ? { ...item, quantity } : item
      );
      
      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions to provide a cleaner API
  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, dispatch, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
