import api from './axios';
import type { Order, OrderStatus, UpdateOrderStatusDto } from '../types/order';

export const ordersApi = {
  async getAll(status?: OrderStatus): Promise<Order[]> {
    const params = status ? { status } : {};
    const response = await api.get<Order[]>('/orders', { params });
    return response.data;
  },

  async getOne(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

