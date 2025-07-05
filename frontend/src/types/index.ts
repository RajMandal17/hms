export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';
  roles?: string[];
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason: string;
  notes: string;
  patient?: Patient;
  doctor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
}

export interface Consultation {
  id: number;
  appointmentId: number;
  patientName?: string;
  patientId?: number;
  doctorName?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  medicines?: Medicine[];
  prescription?: string;
  consultationTime?: string;
  followUpDate?: string | null;
  appointment?: Appointment;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalConsultations: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface WalkInPatient {
  id?: number;
  name: string;
  phone?: string;
  address?: string;
}

export interface Bill {
  id?: number;
  patientId?: number;
  walkInPatientId?: number;
  walkInPatient?: WalkInPatient;
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
  status?: string;
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