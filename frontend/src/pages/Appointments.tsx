import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  InputAdornment,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Appointment, Patient, User } from '../types';
import { appointmentService } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';

export const Appointments: React.FC = () => {
  const { hasAnyRole, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientId: 0,
    doctorId: 0,
    appointmentDate: '',
    appointmentTime: '',
    status: 'SCHEDULED' as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
    reason: '',
    notes: '',
  });

  const canEdit = hasAnyRole(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']);
  const canDelete = hasAnyRole(['ADMIN']);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [page, rowsPerPage, searchTerm]);

  const loadInitialData = async () => {
    try {
      const [patientsData] = await Promise.all([
        patientService.getPatients(),
      ]);
      setPatients(patientsData);
      
      // Mock doctors data - in real app, you'd have a user service
      setDoctors([
        { id: 1, username: 'dr.smith', email: 'dr.smith@hospital.com', role: 'DOCTOR', firstName: 'John', lastName: 'Smith', createdAt: '' },
        { id: 2, username: 'dr.johnson', email: 'dr.johnson@hospital.com', role: 'DOCTOR', firstName: 'Sarah', lastName: 'Johnson', createdAt: '' },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load initial data');
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentsPaged(page, rowsPerPage, searchTerm);
      setAppointments(response.content);
      setTotalCount(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (appointment?: Appointment, mode: 'create' | 'edit' | 'view' = 'create') => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes || '',
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        patientId: 0,
        doctorId: user?.role === 'DOCTOR' ? user.id : 0,
        appointmentDate: '',
        appointmentTime: '',
        status: 'SCHEDULED',
        reason: '',
        notes: '',
      });
    }
    setIsEditing(mode === 'edit');
    setIsViewing(mode === 'view');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setIsEditing(false);
    setIsViewing(false);
  };

  const handleSave = async () => {
    try {
      if (selectedAppointment) {
        await appointmentService.updateAppointment(selectedAppointment.id, formData);
        setSuccess('Appointment updated successfully');
      } else {
        await appointmentService.createAppointment(formData);
        setSuccess('Appointment created successfully');
      }
      handleCloseDialog();
      loadAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(appointment.id);
        setSuccess('Appointment deleted successfully');
        loadAppointments();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete appointment');
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Appointments</Typography>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Schedule Appointment
            </Button>
          )}
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.patient 
                      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                      : 'Unknown Patient'
                    }
                  </TableCell>
                  <TableCell>
                    {appointment.doctor 
                      ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                      : 'Unknown Doctor'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(appointment, 'view')}
                    >
                      <Visibility />
                    </IconButton>
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(appointment, 'edit')}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(appointment)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Appointment Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {isViewing ? 'View Appointment' : isEditing ? 'Edit Appointment' : 'Schedule Appointment'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={patients.find(p => p.id === formData.patientId) || null}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, patientId: newValue?.id || 0 });
                  }}
                  disabled={isViewing}
                  renderInput={(params) => (
                    <TextField {...params} label="Patient" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={doctors}
                  getOptionLabel={(option) => `Dr. ${option.firstName} ${option.lastName}`}
                  value={doctors.find(d => d.id === formData.doctorId) || null}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, doctorId: newValue?.id || 0 });
                  }}
                  disabled={isViewing || user?.role === 'DOCTOR'}
                  renderInput={(params) => (
                    <TextField {...params} label="Doctor" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Appointment Date"
                  value={formData.appointmentDate ? dayjs(formData.appointmentDate) : null}
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      appointmentDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                    })
                  }
                  disabled={isViewing}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Appointment Time"
                  value={formData.appointmentTime ? dayjs(`2000-01-01 ${formData.appointmentTime}`) : null}
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      appointmentTime: newValue ? newValue.format('HH:mm') : '',
                    })
                  }
                  disabled={isViewing}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={isViewing}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    <MenuItem value="NO_SHOW">No Show</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  disabled={isViewing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isViewing}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              {isViewing ? 'Close' : 'Cancel'}
            </Button>
            {!isViewing && (
              <Button onClick={handleSave} variant="contained">
                {isEditing ? 'Update' : 'Schedule'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbars for success/error messages */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert onClose={() => setSuccess('')} severity="success">
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};