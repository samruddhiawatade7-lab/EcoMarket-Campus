import api from './api';
import { Category, DashboardStats, Order, OrderStatus, PageResponse, Product, User } from '../types';

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>('/admin/dashboard');
    return res.data;
  },

  async getUsers(query?: string, role?: string, page: number = 0, size: number = 10): Promise<PageResponse<User>> {
    const res = await api.get<PageResponse<User>>('/admin/users', { params: { query, role, page, size } });
    return res.data;
  },

  async toggleUserStatus(userId: number): Promise<User> {
    const res = await api.put<User>(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  async getPendingProducts(page: number = 0, size: number = 10): Promise<PageResponse<Product>> {
    const res = await api.get<PageResponse<Product>>('/admin/products/pending', { params: { page, size } });
    return res.data;
  },

  async approveProduct(productId: number): Promise<Product> {
    const res = await api.put<Product>(`/admin/products/${productId}/approve`);
    return res.data;
  },

  async rejectProduct(productId: number): Promise<Product> {
    const res = await api.put<Product>(`/admin/products/${productId}/reject`);
    return res.data;
  },

  async getAllOrders(page: number = 0, size: number = 10): Promise<PageResponse<Order>> {
    const res = await api.get<PageResponse<Order>>('/admin/orders', { params: { page, size } });
    return res.data;
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const res = await api.put<Order>(`/admin/orders/${orderId}/status`, null, { params: { status } });
    return res.data;
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const res = await api.post<Category>('/categories', category);
    return res.data;
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    const res = await api.put<Category>(`/categories/${id}`, category);
    return res.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
};
