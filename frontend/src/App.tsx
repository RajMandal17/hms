import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/Layout/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Consultations } from './pages/Consultations';
import { Unauthorized } from './pages/Unauthorized';
import { theme } from './theme/theme';
import PatientHistoryList from './pages/PatientHistoryList';
import PatientHistory from './pages/PatientHistory';
import Billing from './pages/Billing';
import PharmacyMedicines from './pages/PharmacyMedicines';
import PharmacyBatches from './pages/PharmacyBatches';
import PharmacySales from './pages/PharmacySales';
import PharmacyReturns from './pages/PharmacyReturns';
import BillingInsuranceClaims from './pages/BillingInsuranceClaims';
import { IPDBeds } from './pages/IPDBeds';
import { BrowserRouter } from 'react-router-dom';
import BillingRefunds from './pages/BillingRefunds';
import RefundAuditLogPage from './pages/RefundAuditLogPage';
import IPDBilling from './pages/IPDBilling';
import IPDVitals from './pages/IPDVitals';
import IPDConsultations from './pages/IPDConsultations';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <AppLayout>
                    <Patients />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <AppLayout>
                    <Appointments />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultations"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR']}>
                  <AppLayout>
                    <Consultations />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-history"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <AppLayout>
                    <PatientHistoryList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-history/:patientId"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <AppLayout>
                    <PatientHistory />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Pharmacy Module Routes */}
            <Route
              path="/pharmacy/medicines"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'PHARMACIST', 'NURSE']}>
                  <AppLayout>
                    <PharmacyMedicines />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/batches"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'PHARMACIST']}>
                  <AppLayout>
                    <PharmacyBatches />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/sales"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'PHARMACIST']}>
                  <AppLayout>
                    <PharmacySales />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/returns"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'PHARMACIST']}>
                  <AppLayout>
                    <PharmacyReturns />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Billing Module Routes */}
            <Route
              path="/billing"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']}>
                  <AppLayout>
                    <Billing />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing/insurance-claims"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'ACCOUNTANT']}>
                  <AppLayout>
                    <BillingInsuranceClaims />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing/refunds"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'PHARMACIST']}>
                  <AppLayout>
                    <BillingRefunds />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing/refund-audit"
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AppLayout>
                    <RefundAuditLogPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd/beds"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                  <AppLayout>
                    <IPDBeds />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd/billing"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'ACCOUNTANT', 'RECEPTIONIST']}>
                  <AppLayout>
                    <IPDBilling />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd/vitals"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE']}>
                  <AppLayout>
                    <IPDVitals />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd/consultations"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'DOCTOR', 'NURSE']}>
                  <AppLayout>
                    <IPDConsultations />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;