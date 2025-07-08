import { apiService } from './api';
import { Consultation, ApiResponse, PagedResponse } from '../types';

export class IPDConsultationService {
  async getConsultations(): Promise<Consultation[]> {
    const response = await apiService.get<ApiResponse<Consultation[]>>('/ipd/consultations');
    return response.data.data;
  }

  async getConsultationsPaged(page: number = 0, size: number = 10, search?: string): Promise<PagedResponse<Consultation>> {
    const params: any = { page, size };
    if (search) {
      params.doctorName = search;
    }
    const response = await apiService.get<ApiResponse<PagedResponse<Consultation>>>('/ipd/consultations/paged', params);
    return response.data.data;
  }

  async getConsultation(id: number): Promise<Consultation> {
    const response = await apiService.get<ApiResponse<Consultation>>(`/ipd/consultations/${id}`);
    return response.data.data;
  }

  async createConsultation(consultation: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt' | 'appointment'>): Promise<Consultation> {
    const response = await apiService.post<ApiResponse<Consultation>>('/ipd/consultations', consultation);
    return response.data.data;
  }

  async updateConsultation(id: number, consultation: Partial<Consultation>): Promise<Consultation> {
    const response = await apiService.put<ApiResponse<Consultation>>(`/ipd/consultations/${id}`, consultation);
    return response.data.data;
  }

  async deleteConsultation(id: number): Promise<void> {
    await apiService.delete(`/ipd/consultations/${id}`);
  }

  async searchConsultations(query: string): Promise<Consultation[]> {
    const response = await apiService.get<ApiResponse<Consultation[]>>('/ipd/consultations/search', { q: query });
    return response.data.data;
  }

  async getConsultationsByAdmissionId(admissionId: string | number): Promise<Consultation[]> {
    const response = await apiService.get<Consultation[]>(`/ipd/consultations/admission/${admissionId}`);
    return response.data as Consultation[];
  }
}

export const ipdConsultationService = new IPDConsultationService();
