import api from './api';
import { User } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const res = await api.get<User>('/users/me');
    return res.data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const res = await api.put<User>('/users/me', payload);
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/me/password', { currentPassword, newPassword });
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ url: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  }
};
