import { apiService } from './api';

export const doctorRoundService = {
  addDoctorRound: (data: any) => apiService.post('/ipd/rounds', data),
};
