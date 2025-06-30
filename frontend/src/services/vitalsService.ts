import { apiService } from './api';

export const vitalsService = {
  addVitals: (data: any) => apiService.post('/ipd/vitals', data),
};
