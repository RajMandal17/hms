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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
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

export interface Consultation {
  id: number;
  appointmentId: number;
  diagnosis: string;
  prescription: string;
  notes: string;
  followUpDate: string;
  appointment?: Appointment;
  createdAt: string;
  updatedAt: string;
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