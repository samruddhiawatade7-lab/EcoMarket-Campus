import api from './api';
import { College, Campus } from '../types';

export const collegeService = {
  getAllColleges: async (): Promise<College[]> => {
    const response = await api.get<College[]>('/colleges');
    return response.data;
  },

  getCollegeById: async (id: number): Promise<College> => {
    const response = await api.get<College>(`/colleges/${id}`);
    return response.data;
  },

  getCampusesByCollege: async (collegeId: number): Promise<Campus[]> => {
    const response = await api.get<Campus[]>(`/colleges/${collegeId}/campuses`);
    return response.data;
  },
};

export default collegeService;
