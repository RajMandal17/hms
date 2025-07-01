import { apiService } from './api';

export interface PharmacyBatch {
  id: number;
  medicineId: number;
  batchNumber: string;
  expiryDate: string;
  stock: number;
  [key: string]: any;
}

export const getBatches = async (): Promise<PharmacyBatch[]> => {
  const response = await apiService.get<PharmacyBatch[]>('/pharmacy/batches');
  return response.data;
};

export const addBatch = async (batch: Omit<PharmacyBatch, 'id'>): Promise<PharmacyBatch> => {
  const response = await apiService.post<PharmacyBatch>('/pharmacy/batches', batch);
  return response.data;
};

export const updateBatch = async (id: number, batch: Partial<PharmacyBatch>): Promise<PharmacyBatch> => {
  const response = await apiService.put<PharmacyBatch>(`/pharmacy/batches/${id}`, batch);
  return response.data;
};

export const deleteBatch = async (id: number): Promise<void> => {
  await apiService.delete(`/pharmacy/batches/${id}`);
};
