export const updateMedicine = async (id: number, medicine: Partial<Medicine>): Promise<Medicine> => {
  const response = await apiService.put<Medicine>(`/pharmacy/medicines/${id}`, medicine);
  return response.data;
};

export const deleteMedicine = async (id: number): Promise<void> => {
  await apiService.delete(`/pharmacy/medicines/${id}`);
};
import { apiService } from './api';

export interface Medicine {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  expiryDate: string;
  [key: string]: any;
}

export const getMedicines = async (): Promise<Medicine[]> => {
  const response = await apiService.get<Medicine[]>('/pharmacy/medicines');
  return response.data;
};

export const addMedicine = async (medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
  const response = await apiService.post<Medicine>('/pharmacy/medicines', medicine);
  return response.data;
};
