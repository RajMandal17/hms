import { PaymentRecord, localPaymentService } from './localPaymentService';

export interface Payment extends PaymentRecord {}

export const recordPayment = async (payment: Omit<Payment, 'id' | 'date'>) => {
  const newPayment: Payment = {
    ...payment,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
  };
  localPaymentService.add(newPayment);
  return { data: newPayment };
};

export const getPaymentsByPatient = async (patientId: number) => {
  const data = localPaymentService.getByPatient(patientId);
  return { data };
};
