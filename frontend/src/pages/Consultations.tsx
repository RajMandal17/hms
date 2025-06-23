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
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Consultation, Appointment } from '../types';
import { consultationService } from '../services/consultationService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

export const Consultations: React.FC = () => {
  const { hasAnyRole } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    appointmentId: 0,
    diagnosis: '',
    prescription: '',
    notes: '',
    followUpDate: '',
  });

  const canEdit = hasAnyRole(['ADMIN', 'DOCTOR']);
  const canDelete = hasAnyRole(['ADMIN']);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [page, rowsPerPage, searchTerm]);

  const loadInitialData = async () => {
    try {
      const appointmentsData = await appointmentService.getAppointments();
      // Only show completed appointments for consultations
      setAppointments(appointmentsData.filter(apt => apt.status === 'COMPLETED'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load initial data');
    }
  };

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getConsultationsPaged(page, rowsPerPage, searchTerm);
      setConsultations(response.content);
      setTotalCount(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (consultation?: Consultation, mode: 'create' | 'edit' | 'view' = 'create') => {
    if (consultation) {
      setSelectedConsultation(consultation);
      setFormData({
        appointmentId: consultation.appointmentId,
        diagnosis: consultation.diagnosis,
        prescription: consultation.prescription,
        notes: consultation.notes || '',
        followUpDate: consultation.followUpDate || '',
      });
    } else {
      setSelectedConsultation(null);
      setFormData({
        appointmentId: 0,
        diagnosis: '',
        prescription: '',
        notes: '',
        followUpDate: '',
      });
    }
    setIsEditing(mode === 'edit');
    setIsViewing(mode === 'view');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedConsultation(null);
    setIsEditing(false);
    setIsViewing(false);
  };

  const handleSave = async () => {
    try {
      if (selectedConsultation) {
        await consultationService.updateConsultation(selectedConsultation.id, formData);
        setSuccess('Consultation updated successfully');
      } else {
        await consultationService.createConsultation(formData);
        setSuccess('Consultation created successfully');
      }
      handleCloseDialog();
      loadConsultations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save consultation');
    }
  };

  const handleDelete = async (consultation: Consultation) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await consultationService.deleteConsultation(consultation.id);
        setSuccess('Consultation deleted successfully');
        loadConsultations();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete consultation');
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Consultations</Typography>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Consultation
            </Button>
          )}
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search consultations..."
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
                <TableCell>Diagnosis</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    {consultation.appointment?.patient 
                      ? `${consultation.appointment.patient.firstName} ${consultation.appointment.patient.lastName}`
                      : 'Unknown Patient'
                    }
                  </TableCell>
                  <TableCell>
                    {consultation.appointment?.doctor 
                      ? `Dr. ${consultation.appointment.doctor.firstName} ${consultation.appointment.doctor.lastName}`
                      : 'Unknown Doctor'
                    }
                  </TableCell>
                  <TableCell>
                    {consultation.appointment
                      ? new Date(consultation.appointment.appointmentDate).toLocaleDateString()
                      : 'Unknown Date'
                    }
                  </TableCell>
                  <TableCell>{consultation.diagnosis}</TableCell>
                  <TableCell>
                    {consultation.followUpDate 
                      ? new Date(consultation.followUpDate).toLocaleDateString()
                      : 'None'
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(consultation, 'view')}
                    >
                      <Visibility />
                    </IconButton>
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(consultation, 'edit')}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(consultation)}
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

        {/* Consultation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {isViewing ? 'View Consultation' : isEditing ? 'Edit Consultation' : 'Add Consultation'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={appointments}
                  getOptionLabel={(option) => {
                    const patientName = option.patient 
                      ? `${option.patient.firstName} ${option.patient.lastName}`
                      : 'Unknown Patient';
                    const date = new Date(option.appointmentDate).toLocaleDateString();
                    return `${patientName} - ${date}`;
                  }}
                  value={appointments.find(a => a.id === formData.appointmentId) || null}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, appointmentId: newValue?.id || 0 });
                  }}
                  disabled={isViewing}
                  renderInput={(params) => (
                    <TextField {...params} label="Appointment" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Diagnosis"
                  multiline
                  rows={3}
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  disabled={isViewing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prescription"
                  multiline
                  rows={4}
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
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
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Follow-up Date (Optional)"
                  value={formData.followUpDate ? dayjs(formData.followUpDate) : null}
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      followUpDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                    })
                  }
                  disabled={isViewing}
                  slotProps={{ textField: { fullWidth: true } }}
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
                {isEditing ? 'Update' : 'Create'}
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