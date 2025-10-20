import api from './axios';
import type { Package, CreatePackageDto, UpdatePackageDto } from '../types/package';

export const packagesApi = {
  async getAll(): Promise<Package[]> {
    const response = await api.get<Package[]>('/packages');
    return response.data;
  },

  async getOne(id: string): Promise<Package> {
    const response = await api.get<Package>(`/packages/${id}`);
    return response.data;
  },

  async create(data: CreatePackageDto, image?: File): Promise<Package> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    if (image) {
      formData.append('image', image);
    }

    const response = await api.post<Package>('/packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string, data: UpdatePackageDto, image?: File): Promise<Package> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'features' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    if (image) {
      formData.append('image', image);
    }

    const response = await api.patch<Package>(`/packages/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/packages/${id}`);
  },

  async getStats() {
    const response = await api.get('/packages/stats');
    return response.data;
  },
};

