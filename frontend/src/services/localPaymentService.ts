// Local Payment Service for OPD/IPD/Pharmacy payments using localStorage

export interface PaymentRecord {
  id: string; // unique id
  patientId: number;
  billId?: number;
  type: 'OPD' | 'IPD' | 'PHARMACY';
  amount: number;
  date: string;
  method: string;
  notes?: string;
  deposit?: number; // for IPD
  partial?: boolean;
}

const STORAGE_KEY = 'hms_payments';

export const localPaymentService = {
  getAll(): PaymentRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  getByPatient(patientId: number): PaymentRecord[] {
    return this.getAll().filter(p => p.patientId === patientId);
  },
  add(payment: PaymentRecord) {
    const all = this.getAll();
    all.push(payment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },
  update(id: string, update: Partial<PaymentRecord>) {
    const all = this.getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...update };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  },
  remove(id: string) {
    const all = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
