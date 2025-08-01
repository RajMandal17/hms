import { apiService as api } from './api';

// Fetch pending bills (for billing alerts)
export const getPendingBills = () => api.get('/billing/bills/pending');
export const downloadBillPdf = (billId: number) => api.get(`/billing/bills/${billId}/pdf`, { responseType: 'blob' });

export interface Bill {
  id?: number;
  patientId?: number;
  walkInPatientId?: number;
  billType: string;
  totalAmount: number;
  paidAmount?: number;
  status?: string;
  items?: BillItem[];
  payments?: Payment[];
  insuranceClaim?: InsuranceClaim;
}

export interface BillItem {
  id?: number;
  description: string;
  amount: number;
  sourceType?: string;
  sourceId?: number;
}

export interface Payment {
  id?: number;
  amount: number;
  mode: string;
  paidAt?: string;
  reference?: string;
}

export interface InsuranceClaim {
  id?: number;
  tpaName: string;
  claimNumber: string;
  claimedAmount: number;
  approvedAmount?: number;
  status?: string;
  remarks?: string;
}

export interface BillingSummary {
  totalRevenue: number;
  totalPaid: number;
  totalUnpaid: number;
  billCount: number;
}

export const createBill = (bill: Bill) => api.post('/billing/bills', bill);
export const getBill = (id: number) => api.get(`/billing/bills/${id}`);
export const getAllBills = () => api.get('/billing/bills');
export const makePayment = (billId: number, payment: Payment) => api.post(`/billing/bills/${billId}/payment`, payment);
export const claimInsurance = (billId: number, claim: InsuranceClaim) => api.post(`/billing/bills/${billId}/insurance-claim`, claim);
export const addBillItem = (billId: number, item: BillItem) => api.post(`/billing/bills/${billId}/items`, item);
export const updateBillItem = (itemId: number, item: BillItem) => api.put(`/billing/bills/items/${itemId}`, item);
export const deleteBillItem = (itemId: number) => api.delete(`/billing/bills/items/${itemId}`);
export const getBillingSummary = () => api.get<BillingSummary>('/billing/summary');
export const getConsolidatedIPDBill = (admissionId: number) => api.get(`/billing/ipd/consolidated/${admissionId}`);
export const finalizeConsolidatedIPDBill = (
  admissionId: number,
  customItems: { description: string; amount: number }[]
) => api.post(`/billing/ipd/consolidated/${admissionId}/finalize`, customItems);
export const getBillsByPatient = (patientId: number) => api.get(`/billing/bills/patient/${patientId}`);
