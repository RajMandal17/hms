import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TextField,
  Modal,
  Avatar,
  IconButton,
  Divider,
  LinearProgress,
  Stack,
  Badge,
} from '@mui/material';
import {
  People,
  CalendarToday,
  Assignment,
  TrendingUp,
  LocalHospital,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  Notifications,
  Add,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
import { consultationService } from '../services/consultationService';
import { getBillingSummary, BillingSummary } from '../services/billingService';
import { Appointment } from '../types';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout/AppLayout';

// Types for pharmacy alerts
interface MedicineBatchAlert {
  id: number;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  medicine: { name: string };
}

// Types for billing alerts
interface PendingBill {
  id: number;
  patientId: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
}

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
  trend?: number;
  subtitle?: string;
}> = ({ title, value, icon, color, trend, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 3,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 16px ${color}40`,
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: 'white', fontSize: 28 },
          })}
        </Box>
        {trend && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
            <Typography variant="body2" color="#10b981" fontWeight={600}>
              +{trend}%
            </Typography>
          </Box>
        )}
      </Box>
      
      <Typography variant="h3" fontWeight={700} color="text.primary" mb={0.5}>
        {value.toLocaleString()}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
    
    {/* Decorative background element */}
    <Box
      sx={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: `${color}10`,
        zIndex: 0,
      }}
    />
  </Card>
);

const AlertCard: React.FC<{
  title: string;
  items: any[];
  type: 'error' | 'warning' | 'info';
  loading: boolean;
  error: string;
  onRefresh: () => void;
}> = ({ title, items, type, loading, error, onRefresh }) => {
  const getColor = () => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error': return <Warning />;
      case 'warning': return <Schedule />;
      case 'info': return <Notifications />;
      default: return <Notifications />;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                backgroundColor: `${getColor()}15`,
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(getIcon(), {
                sx: { color: getColor(), fontSize: 20 },
              })}
            </Box>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          </Box>
          
          <IconButton onClick={onRefresh} size="small">
            <Refresh fontSize="small" />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : items.length === 0 ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              All clear! No issues found.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {items.slice(0, 3).map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {item.medicine?.name || `Bill #${item.id}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.batchNumber ? `Batch: ${item.batchNumber} - Qty: ${item.quantity}` : 
                   `Patient ID: ${item.patientId} - Due: ₹${item.totalAmount - (item.paidAmount || 0)}`}
                </Typography>
              </Box>
            ))}
            {items.length > 3 && (
              <Typography variant="caption" color="text.secondary" textAlign="center">
                +{items.length - 3} more items
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard state
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
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Billing state
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingSummaryLoading, setBillingSummaryLoading] = useState(false);
  const [billingSummaryError, setBillingSummaryError] = useState('');

  // Pharmacy alert state
  const [lowStock, setLowStock] = useState<MedicineBatchAlert[]>([]);
  const [expiring, setExpiring] = useState<MedicineBatchAlert[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);
  const [pharmacyError, setPharmacyError] = useState('');

  // Billing alert state
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState('');

  useEffect(() => {
    loadDashboardData();
    fetchBillingSummary();
    fetchPharmacyAlerts();
    fetchBillingAlerts();
  }, []);

  const fetchPharmacyAlerts = async () => {
    try {
      setPharmacyLoading(true);
      setPharmacyError('');
      const [lowStockRes, expiringRes] = await Promise.all([
        axios.get('/api/pharmacy/batches/low-stock?threshold=10'),
        axios.get('/api/pharmacy/batches/expiring?daysAhead=30'),
      ]);
      setLowStock(lowStockRes.data);
      setExpiring(expiringRes.data);
    } catch (err: any) {
      setPharmacyError('Failed to load pharmacy alerts');
    } finally {
      setPharmacyLoading(false);
    }
  };

  const fetchBillingAlerts = async () => {
    try {
      setBillingLoading(true);
      setBillingError('');
      const res = await axios.get('/api/billing/bills/pending');
      setPendingBills(res.data);
    } catch (err: any) {
      setBillingError('Failed to load billing alerts');
    } finally {
      setBillingLoading(false);
    }
  };

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

  const fetchBillingSummary = async () => {
    try {
      setBillingSummaryLoading(true);
      setBillingSummaryError('');
      const res = await getBillingSummary();
      setBillingSummary(res.data);
    } catch (err: any) {
      setBillingSummaryError('Failed to load billing summary');
    } finally {
      setBillingSummaryLoading(false);
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
      await patientService.createPatient(formData, true);
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

  const handleDataChanged = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <AppLayout onPatientRegistered={handleDataChanged} onAppointmentBooked={handleDataChanged}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} />
        </Box>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout onPatientRegistered={handleDataChanged} onAppointmentBooked={handleDataChanged}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout onPatientRegistered={handleDataChanged} onAppointmentBooked={handleDataChanged}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header Section */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Welcome back, {user?.firstName || user?.username} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Here's what's happening at your hospital today
          </Typography>

          {/* Quick Actions */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenRegister(true)}
              sx={{ borderRadius: 2 }}
            >
              Register Patient
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadDashboardData}
              sx={{ borderRadius: 2 }}
            >
              Refresh Data
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={<People />}
              color="#2563eb"
              trend={12}
              subtitle="Active patients in system"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Appointments"
              value={stats.totalAppointments}
              icon={<CalendarToday />}
              color="#10b981"
              trend={8}
              subtitle="Total appointments booked"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Consultations"
              value={stats.totalConsultations}
              icon={<Assignment />}
              color="#f59e0b"
              trend={15}
              subtitle="Completed consultations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #8b5cf615 0%, #8b5cf605 100%)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      backgroundColor: '#8b5cf6',
                      borderRadius: 3,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AttachMoney sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Revenue
                  </Typography>
                </Box>
                
                {billingSummaryLoading ? (
                  <CircularProgress size={20} />
                ) : billingSummaryError ? (
                  <Typography variant="body2" color="error">
                    Failed to load
                  </Typography>
                ) : billingSummary ? (
                  <>
                    <Typography variant="h4" fontWeight={700} color="text.primary" mb={0.5}>
                      ₹{billingSummary.totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Total Revenue
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(billingSummary.totalPaid / billingSummary.totalRevenue) * 100}
                      sx={{ borderRadius: 1, height: 6 }}
                    />
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      ₹{billingSummary.totalPaid.toLocaleString()} collected
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No billing data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alert Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <AlertCard
              title="Low Stock Medicines"
              items={lowStock}
              type="error"
              loading={pharmacyLoading}
              error={pharmacyError}
              onRefresh={fetchPharmacyAlerts}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AlertCard
              title="Expiring Soon"
              items={expiring}
              type="warning"
              loading={pharmacyLoading}
              error={pharmacyError}
              onRefresh={fetchPharmacyAlerts}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AlertCard
              title="Pending Bills"
              items={pendingBills}
              type="info"
              loading={billingLoading}
              error={billingError}
              onRefresh={fetchBillingAlerts}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Patients */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Patients
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/patients')}
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Box>

                {stats.totalPatients === 0 ? (
                  <Box textAlign="center" py={4}>
                    <LocalHospital sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No patients found. Register your first patient to get started.
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {patients.slice(0, 6).map((patient: any) => (
                      <ListItem
                        key={patient.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          border: '1px solid #e2e8f0',
                          '&:hover': { backgroundColor: '#f8fafc' },
                        }}
                      >
                        <Avatar
                          src={
                            patient.photoUrl?.startsWith('http')
                              ? patient.photoUrl
                              : `http://localhost:8080${patient.photoUrl}`
                          }
                          sx={{ mr: 2, width: 48, height: 48 }}
                        >
                          {patient.firstName?.[0] || patient.name?.[0] || '?'}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={500}>
                              {patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {patient.gender} • {patient.age} years • {patient.phone || patient.contact}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {patient.address}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Appointments & Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Recent Appointments */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Recent Appointments
                  </Typography>
                  
                  {recentAppointments.length === 0 ? (
                    <Box textAlign="center" py={2}>
                      <CalendarToday sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No recent appointments
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {recentAppointments.map((appointment) => (
                        <ListItem key={appointment.id} sx={{ px: 0, py: 1 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={500}>
                                {appointment.patient?.firstName || 'Unknown Patient'}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                                {appointment.appointmentTime}
                              </Typography>
                            }
                          />
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status) as any}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    System Status
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" justifyContent="between">
                      <Typography variant="body2">Your Role</Typography>
                      <Chip
                        label={user?.role || 'Unknown'}
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="between">
                      <Typography variant="body2">System Status</Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                          }}
                        />
                        <Typography variant="body2" color="#10b981" fontWeight={500}>
                          Online
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="between">
                      <Typography variant="body2">Last Updated</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date().toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};