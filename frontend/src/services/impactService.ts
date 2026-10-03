import api from './api';
import { SustainabilityImpact } from '../types';

export const impactService = {
  async getGlobalImpact(): Promise<SustainabilityImpact> {
    const res = await api.get<SustainabilityImpact>('/impact/global');
    return res.data;
  },

  async getUserImpact(): Promise<SustainabilityImpact> {
    const res = await api.get<SustainabilityImpact>('/impact/user');
    return res.data;
  }
};
