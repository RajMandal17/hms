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

export interface PendingPrescriptionDTO {
  id: number;
  type: 'OPD' | 'IPD';
  patientId: number | null;
  doctorId: number | null;
  doctorName?: string;
  status: string;
  createdAt: string;
}

export const getPendingPrescriptions = async (): Promise<PendingPrescriptionDTO[]> => {
  const response = await apiService.get<PendingPrescriptionDTO[]>('/pharmacy/sales/pending-prescriptions');
  return response.data;
};

export interface FulfillPrescriptionPayload {
  prescriptionId: number;
  patientId: number | null;
  saleType: 'OPD' | 'IPD';
  paymentMode: string;
  items: Array<{
    batchId: number;
    quantity: number;
  }>;
}

export const fulfillPrescription = async (payload: FulfillPrescriptionPayload) => {
  const response = await apiService.post('/pharmacy/sales/fulfill', payload);
  return response.data;
};

export const getPrescriptionDetails = async (prescriptionId: number, type: 'OPD' | 'IPD') => {
  if (type === 'OPD') {
    // OPD: fetch consultation details
    const response = await apiService.get(`/opd/consultations/${prescriptionId}`);
    return response.data;
  } else {
    // IPD: fetch IPD prescription details
    const response = await apiService.get(`/ipd/prescriptions/${prescriptionId}`);
    return response.data;
  }
};
