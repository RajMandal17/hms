import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';

interface BookAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ open, onClose, onSuccess }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]); // You should implement doctorService
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setPatientsLoading(true);
      setDoctorsLoading(true);
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setDate(null);
      setTime(null);
      setReason('');
      setError('');
      patientService.getPatients().then(setPatients).finally(() => setPatientsLoading(false));
      fetch('/api/opd/doctors')
        .then(res => res.json())
        .then(data => setDoctors(data.data || []))
        .catch(() => setDoctors([]))
        .finally(() => setDoctorsLoading(false));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedDoctor || !date || !time) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Use Dayjs format for date and time
      const appointmentDate = (date as any).format ? (date as any).format('YYYY-MM-DD') : date.toISOString().split('T')[0];
      const appointmentTime = (time as any).format ? (time as any).format('HH:mm:ss') : time.toTimeString().split(' ')[0];
      const payload = {
        patientId: selectedPatient.id,
        doctorId: selectedDoctor.id,
        appointmentDate,
        appointmentTime,
        reason
      };
      console.log('Booking appointment with payload:', payload);
      await appointmentService.createAppointment(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      // Enhanced error handling for user-friendly messages
      let message = 'Failed to book appointment';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSuccess(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => option.name || `${option.firstName || ''} ${option.lastName || ''}`}
            value={selectedPatient}
            onChange={(_, value) => setSelectedPatient(value)}
            loading={patientsLoading}
            renderInput={(params) => <TextField {...params} label="Select Patient" margin="normal" fullWidth InputProps={{...params.InputProps, endAdornment: patientsLoading ? <CircularProgress size={20} /> : params.InputProps.endAdornment}} />}
          />
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => option.name}
            value={selectedDoctor}
            onChange={(_, value) => setSelectedDoctor(value)}
            loading={doctorsLoading}
            renderInput={(params) => <TextField {...params} label="Select Doctor" margin="normal" fullWidth InputProps={{...params.InputProps, endAdornment: doctorsLoading ? <CircularProgress size={20} /> : params.InputProps.endAdornment}} />}
          />
          <Box display="flex" gap={2} mt={2}>
            <DatePicker
              label="Date"
              value={date}
              onChange={setDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <TimePicker
              label="Time"
              value={time}
              onChange={setTime}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          <TextField
            label="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            margin="normal"
            fullWidth
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !selectedPatient || !selectedDoctor || !date || !time}>
            {loading ? <CircularProgress size={24} /> : 'Book'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Appointment booked successfully!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </LocalizationProvider>
  );
};
