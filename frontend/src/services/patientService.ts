import { apiService } from './api';
import { Patient, ApiResponse, PagedResponse } from '../types';

export class PatientService {
  async getPatients(): Promise<Patient[]> {
    const response = await apiService.get<ApiResponse<Patient[]>>('/opd/patients');
    return response.data.data;
  }

  async getPatientsPaged(page: number = 0, size: number = 10, search?: string): Promise<PagedResponse<Patient>> {
    const params = { page, size };
    if (search) {
      (params as any).search = search;
    }
    const response = await apiService.get<ApiResponse<PagedResponse<Patient>>>('/opd/patients/paged', params);
    return response.data.data;
  }

  async getPatient(id: number): Promise<Patient> {
    const response = await apiService.get<ApiResponse<Patient>>(`/opd/patients/${id}`);
    return response.data.data;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const response = await apiService.post<ApiResponse<Patient>>('/opd/patients', patient);
    return response.data.data;
  }

  async updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
    const response = await apiService.put<ApiResponse<Patient>>(`/opd/patients/${id}`, patient);
    return response.data.data;
  }

  async deletePatient(id: number): Promise<void> {
    await apiService.delete(`/opd/patients/${id}`);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const response = await apiService.get<ApiResponse<Patient[]>>('/opd/patients/search', { q: query });
    return response.data.data;
  }
}

export const patientService = new PatientService();