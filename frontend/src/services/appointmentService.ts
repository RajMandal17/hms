import { apiService } from './api';
import { Appointment, ApiResponse, PagedResponse } from '../types';

export class AppointmentService {
  async getAppointments(): Promise<Appointment[]> {
    const response = await apiService.get<ApiResponse<Appointment[]>>('/opd/appointments');
    return response.data.data;
  }

  async getAppointmentsPaged(page: number = 0, size: number = 10, search?: string): Promise<PagedResponse<Appointment>> {
    const params = { page, size };
    if (search) {
      (params as any).search = search;
    }
    const response = await apiService.get<ApiResponse<PagedResponse<Appointment>>>('/opd/appointments/paged', params);
    return response.data.data;
  }

  async getAppointment(id: number): Promise<Appointment> {
    const response = await apiService.get<ApiResponse<Appointment>>(`/opd/appointments/${id}`);
    return response.data.data;
  }

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>): Promise<Appointment> {
    const response = await apiService.post<ApiResponse<Appointment>>('/opd/appointments', appointment);
    return response.data.data;
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await apiService.put<ApiResponse<Appointment>>(`/opd/appointments/${id}`, appointment);
    return response.data.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await apiService.delete(`/opd/appointments/${id}`);
  }

  async searchAppointments(query: string): Promise<Appointment[]> {
    const response = await apiService.get<ApiResponse<Appointment[]>>('/opd/appointments/search', { q: query });
    return response.data.data;
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const response = await apiService.get<ApiResponse<Appointment[]>>('/opd/appointments/today');
    return response.data.data;
  }
}

export const appointmentService = new AppointmentService();