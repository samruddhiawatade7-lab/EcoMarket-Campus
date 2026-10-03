import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    const updated = await cartService.addToCart(productId, quantity);
    setCart(updated);
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const updated = await cartService.updateQuantity(itemId, quantity);
    setCart(updated);
  };

  const removeItem = async (itemId: number) => {
    const updated = await cartService.removeItem(itemId);
    setCart(updated);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart(prev => prev ? { ...prev, items: [], subtotal: 0, totalAmount: 0, co2Saved: 0, waterSaved: 0, wasteReduced: 0 } : null);
  };

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, itemCount, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
