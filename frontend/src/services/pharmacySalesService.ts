import { apiService } from './api';

export interface PharmacySaleItem {
  id: number;
  medicineId: number;
  batchId: number;
  quantity: number;
  price: number;
}

export interface PharmacySale {
  id: number;
  patientId: number;
  saleDate: string;
  items: PharmacySaleItem[];
  totalAmount: number;
  [key: string]: any;
}

export const getSales = async (): Promise<PharmacySale[]> => {
  const response = await apiService.get<PharmacySale[]>('/pharmacy/sales');
  return response.data;
};

export const addSale = async (sale: Omit<PharmacySale, 'id'>): Promise<PharmacySale> => {
  const response = await apiService.post<PharmacySale>('/pharmacy/sales', sale);
  return response.data;
};
