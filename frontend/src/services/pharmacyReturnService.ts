// Local storage service for pharmacy returns and refunds
export interface PharmacyReturn {
  id: string;
  billId: number;
  patientId: number;
  medicine: string;
  quantity: number;
  amount: number;
  date: string;
  reason: string;
  refundMode: string;
}

const STORAGE_KEY = 'hms_pharmacy_returns';

export const pharmacyReturnService = {
  getAll(): PharmacyReturn[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  add(returnObj: PharmacyReturn) {
    const all = this.getAll();
    all.push(returnObj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },
  getByPatient(patientId: number): PharmacyReturn[] {
    return this.getAll().filter(r => r.patientId === patientId);
  },
  remove(id: string) {
    const all = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
