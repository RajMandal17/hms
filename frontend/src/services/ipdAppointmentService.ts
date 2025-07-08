import { apiService } from './api';
import { ApiResponse } from '../types';

export class IPDAppointmentService {
  async getAdmissions(): Promise<any[]> {
    const response = await apiService.get<ApiResponse<any[]>>('/ipd/admissions');
    return response.data.data;
  }
}

export const ipdAppointmentService = new IPDAppointmentService();
