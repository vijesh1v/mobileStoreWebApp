import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  brand: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  image_url: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const response = await api.get('/cart');
      setItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await api.post('/cart', { product_id: productId, quantity });
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove from cart');
    }
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

