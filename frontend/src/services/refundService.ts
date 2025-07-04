import { apiService as api } from './api';

export interface Refund {
  id?: number;
  bill?: number;
  amount: number;
  reason: string;
  processedBy: string;
  processedAt?: string;
  status?: string;
}

export const processRefund = (billId: number, amount: number, reason: string, processedBy: string) =>
  api.post(`/billing/refunds?billId=${billId}&amount=${amount}&reason=${encodeURIComponent(reason)}&processedBy=${encodeURIComponent(processedBy)}`);

export const getRefundsByBill = (billId: number) =>
  api.get(`/billing/refunds/by-bill/${billId}`);

export const getAllRefunds = () =>
  api.get('/billing/refunds');
