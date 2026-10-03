import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: Set<number>;
  loading: boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const items = await wishlistService.getWishlist();
      setWishlist(items);
      setWishlistIds(new Set(items.map(item => item.id)));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (wishlistIds.has(productId)) {
      await wishlistService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(p => p.id !== productId));
      setWishlistIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      return false;
    } else {
      await wishlistService.addToWishlist(productId);
      await fetchWishlist();
      return true;
    }
  };

  const isInWishlist = (productId: number) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{
      wishlist, wishlistIds, loading, toggleWishlist, isInWishlist, refreshWishlist: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
