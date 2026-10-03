import api from './api';
import { Product } from '../types';

export const wishlistService = {
  async getWishlist(): Promise<Product[]> {
    const res = await api.get<Product[]>('/wishlist');
    return res.data;
  },

  async addToWishlist(productId: number): Promise<void> {
    await api.post(`/wishlist/${productId}`);
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await api.delete(`/wishlist/${productId}`);
  },

  async checkWishlist(productId: number): Promise<boolean> {
    const res = await api.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
    return res.data.inWishlist;
  }
};
