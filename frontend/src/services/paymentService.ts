import { apiService as api } from './api';

export interface Payment {
  id?: number;
  bill?: number;
  patientId?: number;
  appointmentId?: number;
  amount: number;
  mode: string;
  paidAt?: string;
  reference?: string;
  status?: string;
}

export const recordPayment = (payment: Payment) => api.post('/payments/record', payment);
export const getPaymentsByPatient = (patientId: number) => api.get(`/payments/by-patient/${patientId}`);
export const getPaymentsByAppointment = (appointmentId: number) => api.get(`/payments/by-appointment/${appointmentId}`);
