import api from './api';
import { Review } from '../types';

export const reviewService = {
  async getProductReviews(productId: number): Promise<Review[]> {
    const res = await api.get<Review[]>(`/products/${productId}/reviews`);
    return res.data;
  },

  async createReview(productId: number, rating: number, comment: string): Promise<Review> {
    const res = await api.post<Review>(`/products/${productId}/reviews`, { rating, comment });
    return res.data;
  }
};
