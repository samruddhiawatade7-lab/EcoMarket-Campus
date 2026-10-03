import api from './api';
import { AuthResponse, User } from '../types';

export interface VerifyEmailPayload {
  collegeEmail: string;
  code: string;
  collegeId?: number;
  campusId?: number;
  course?: string;
  graduationYear?: number;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('ecomarket_token', res.data.token);
      localStorage.setItem('ecomarket_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async register(data: any): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('ecomarket_token', res.data.token);
      localStorage.setItem('ecomarket_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  async verifyCollegeEmail(payload: VerifyEmailPayload): Promise<User> {
    const res = await api.post<User>('/auth/verify-college-email', payload);
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('ecomarket_token');
    localStorage.removeItem('ecomarket_user');
  },

  getStoredUser(): AuthResponse | null {
    const userStr = localStorage.getItem('ecomarket_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;
