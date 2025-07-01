import axios from 'axios';
import { apiService } from './api';

export const patientService = {
  getPatients: () => apiService.get('/opd/patients').then(res => res.data.data),
  createPatient: (formData: FormData) =>
    apiService.post('/opd/patients', formData).then(res => res.data),
  updatePatient: (id: number, data: any) =>
    apiService.put(`/opd/patients/${id}`, data).then(res => res.data),
  // ...other patient methods
};