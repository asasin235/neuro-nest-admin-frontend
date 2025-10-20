import api from './axios';
import type { User, CreateUserDto, UpdateUserDto, ChangeRoleDto } from '../types/user';

export const usersApi = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getOne(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async changeRole(id: string, data: ChangeRoleDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/role`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getStats() {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

