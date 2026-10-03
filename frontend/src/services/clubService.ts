import api from './api';
import { Club } from '../types';

export const clubService = {
  getAllClubs: async (collegeId?: number): Promise<Club[]> => {
    const params = collegeId ? { collegeId } : {};
    const response = await api.get<Club[]>('/clubs', { params });
    return response.data;
  },

  createClub: async (payload: Partial<Club>): Promise<Club> => {
    const response = await api.post<Club>('/clubs', payload);
    return response.data;
  },
};

export default clubService;
