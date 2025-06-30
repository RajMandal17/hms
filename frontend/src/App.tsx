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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;