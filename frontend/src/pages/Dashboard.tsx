import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Stack,
  TextField,
  Modal,
} from '@mui/material';
import {
  People,
  CalendarToday,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
import { consultationService } from '../services/consultationService';
import { Appointment } from '../types';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout/AppLayout';

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalConsultations: number;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: 'white', fontSize: 32 },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalConsultations: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openRegister, setOpenRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    photo: null as File | null,
    // Add other fields as needed
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointments, consultations] = await Promise.all([
        patientService.getPatients(),
        appointmentService.getAppointments(),
        consultationService.getConsultations(),
      ]);

      setPatients(patientsData);

      setStats({
        totalPatients: patientsData.length,
        totalAppointments: appointments.length,
        totalConsultations: consultations.length,
      });

      // Get recent appointments (last 5)
      const sortedAppointments = appointments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentAppointments(sortedAppointments);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files.length > 0) {
      setRegisterData({ ...registerData, photo: files[0] });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    try {
      const formData = new FormData();
      formData.append('firstName', registerData.firstName);
      formData.append('lastName', registerData.lastName);
      formData.append('age', registerData.age);
      formData.append('gender', registerData.gender);
      formData.append('phone', registerData.phone);
      formData.append('address', registerData.address);
      if (registerData.photo) {
        formData.append('photo', registerData.photo);
      }
      await patientService.createPatient(formData, true); // true = multipart
      setOpenRegister(false);
      loadDashboardData();
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      return loadDashboardData();
    }

    setLoading(true);
    try {
      const patientsData = await patientService.searchPatients(searchTerm);
      setPatients(patientsData);

      setStats((prevStats) => ({
        ...prevStats,
        totalPatients: patientsData.length,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search patients');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'NO_SHOW':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Handler for patient registration or appointment booking success
  const handleDataChanged = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <AppLayout
      onPatientRegistered={handleDataChanged}
      onAppointmentBooked={handleDataChanged}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Here's what's happening at your hospital today
        </Typography>
        {/* Inline Patient List Preview */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Patients
          </Typography>
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {stats.totalPatients === 0 ? (
              <Typography color="text.secondary">No patients found.</Typography>
            ) : (
              patients.map((patient: any) => (
                <ListItem key={patient.id} divider>
                  {/* Patient Photo Avatar */}
                  {patient.photoUrl ? (
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      <img
                        src={
                          patient.photoUrl.startsWith('http')
                            ? patient.photoUrl
                            : `http://localhost:8080${patient.photoUrl}`
                        }
                        alt={patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`}
                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          color: '#757575',
                          border: '1px solid #eee',
                        }}
                      >
                        {patient.firstName ? patient.firstName[0] : '?'}
                      </Box>
                    </Box>
                  )}
                  <ListItemText
                    primary={patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {patient.gender} | {patient.phone || patient.contact}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.address}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={<People />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Appointments"
              value={stats.totalAppointments}
              icon={<CalendarToday />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Consultations"
              value={stats.totalConsultations}
              icon={<Assignment />}
              color="#ed6c02"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Appointments
              </Typography>
              {recentAppointments.length === 0 ? (
                <Typography color="text.secondary">
                  No recent appointments found.
                </Typography>
              ) : (
                <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {recentAppointments.map((appointment) => (
                    <ListItem key={appointment.id} divider>
                      <ListItemText
                        primary={
                          appointment.patient
                            ? appointment.patient.firstName && appointment.patient.lastName
                              ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                              : appointment.patient.name // fallback to single name field from backend
                            : 'Unknown Patient'
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                              {appointment.appointmentTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {appointment.reason}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your Role: <strong>{user?.role}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  System Status: <strong style={{ color: '#2e7d32' }}>Online</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Login: <strong>{new Date().toLocaleDateString()}</strong>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};