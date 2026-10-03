import api from './api';
import { DashboardStats, Order, OrderStatus, PageResponse, Product } from '../types';

export const sellerService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>('/seller/dashboard');
    return res.data;
  },

  async getSellerProducts(page: number = 0, size: number = 10): Promise<PageResponse<Product>> {
    const res = await api.get<PageResponse<Product>>('/seller/products', { params: { page, size } });
    return res.data;
  },

  async getSellerOrders(page: number = 0, size: number = 10): Promise<PageResponse<Order>> {
    const res = await api.get<PageResponse<Order>>('/seller/orders', { params: { page, size } });
    return res.data;
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const res = await api.put<Order>(`/seller/orders/${orderId}/status`, null, { params: { status } });
    return res.data;
  }
};
