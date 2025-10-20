import axios from './axios';
import type { Component } from '../types/product';

export const productsAPI = {
  getAll: () => axios.get<Component[]>('/products'),
  
  getLowStock: () => axios.get<Component[]>('/products/low-stock'),
  
  getStats: () => axios.get<{
    total: number;
    outOfStock: number;
    lowStock: number;
    totalInventoryValue: number;
  }>('/products/stats'),
  
  getOne: (id: string) => axios.get<Component>(`/products/${id}`),
  
  create: (data: FormData) => axios.post<Component>('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  update: (id: string, data: FormData) => axios.patch<Component>(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  updateStock: (id: string, quantity: number) => axios.patch<Component>(`/products/${id}/stock`, { quantity }),
  
  delete: (id: string) => axios.delete(`/products/${id}`),
};

