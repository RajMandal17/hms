import { apiService } from './api';
import { Consultation, ApiResponse, PagedResponse } from '../types';

export class ConsultationService {
  async getConsultations(): Promise<Consultation[]> {
    const response = await apiService.get<ApiResponse<Consultation[]>>('/opd/consultations');
    return response.data.data;
  }

  async getConsultationsPaged(page: number = 0, size: number = 10, search?: string): Promise<PagedResponse<Consultation>> {
    const params = { page, size };
    if (search) {
      (params as any).search = search;
    }
    const response = await apiService.get<ApiResponse<PagedResponse<Consultation>>>('/opd/consultations/paged', params);
    return response.data.data;
  }

  async getConsultation(id: number): Promise<Consultation> {
    const response = await apiService.get<ApiResponse<Consultation>>(`/opd/consultations/${id}`);
    return response.data.data;
  }

  async createConsultation(consultation: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt' | 'appointment'>): Promise<Consultation> {
    const response = await apiService.post<ApiResponse<Consultation>>('/opd/consultations', consultation);
    return response.data.data;
  }

  async updateConsultation(id: number, consultation: Partial<Consultation>): Promise<Consultation> {
    const response = await apiService.put<ApiResponse<Consultation>>(`/opd/consultations/${id}`, consultation);
    return response.data.data;
  }

  async deleteConsultation(id: number): Promise<void> {
    await apiService.delete(`/opd/consultations/${id}`);
  }

  async searchConsultations(query: string): Promise<Consultation[]> {
    const response = await apiService.get<ApiResponse<Consultation[]>>('/opd/consultations/search', { q: query });
    return response.data.data;
  }
}

export const consultationService = new ConsultationService();