import api from './api';
import { CheckoutPayload, Order, OrderStatus, PageResponse } from '../types';

export const orderService = {
  async createOrder(payload: CheckoutPayload): Promise<Order> {
    const res = await api.post<Order>('/orders', payload);
    return res.data;
  },

  async getUserOrders(page: number = 0, size: number = 10): Promise<PageResponse<Order>> {
    const res = await api.get<PageResponse<Order>>('/orders', { params: { page, size } });
    return res.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const res = await api.put<Order>(`/orders/${id}/status`, null, { params: { status } });
    return res.data;
  },

  async verifyHandoverCode(id: number, handoverCode: string): Promise<Order> {
    const res = await api.post<Order>(`/orders/${id}/verify-handover`, { handoverCode });
    return res.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const res = await api.put<Order>(`/orders/${id}/cancel`);
    return res.data;
  }
};
