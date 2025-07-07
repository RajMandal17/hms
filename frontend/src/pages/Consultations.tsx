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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Consultation, Appointment, Medicine } from '../types';
import { consultationService } from '../services/consultationService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { getMedicines } from '../services/pharmacyService';

// --- Types for Consultation Form Medicines ---
interface ConsultationFormMedicine {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  quantity?: string | number;
}

export const Consultations: React.FC = () => {
  const { hasAnyRole } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicineOptions, setMedicineOptions] = useState<string[]>([]);
  const [medicineList, setMedicineList] = useState<Medicine[]>([]);
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
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    followUpDate: '',
    fee: '',
    medicines: [
      { name: '', dose: '', frequency: '', duration: '', quantity: '' }
    ] as ConsultationFormMedicine[],
  });

  const canEdit = hasAnyRole(['ADMIN', 'DOCTOR']);
  const canDelete = hasAnyRole(['ADMIN']);

  useEffect(() => {
    loadInitialData();
    // Fetch medicine names and details for autocomplete
    getMedicines().then(meds => {
      setMedicineOptions(meds.map(m => m.name));
      setMedicineList(meds);
    });
  }, []);

  useEffect(() => {
    loadConsultations();
  }, [page, rowsPerPage, searchTerm]);

  const loadInitialData = async () => {
    try {
      const appointmentsData = await appointmentService.getAppointments();
      // Show all appointments for consultations (remove COMPLETED filter)
      setAppointments(appointmentsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load initial data');
    }
  };

  const loadConsultations = async () => {
    try {
      const response = await consultationService.getConsultationsPaged(page, rowsPerPage, searchTerm);
      setConsultations(response.content);
      setTotalCount(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consultations');
    }
  };

  const handleOpenDialog = (consultation?: Consultation, mode: 'create' | 'edit' | 'view' = 'create') => {
    if (consultation) {
      setSelectedConsultation(consultation);
      setFormData({
        appointmentId: consultation.appointmentId,
        symptoms: consultation.symptoms || '',
        diagnosis: consultation.diagnosis || '',
        prescription: consultation.prescription || '',
        notes: consultation.notes || '',
        followUpDate: consultation.followUpDate || '',
        fee: consultation.fee !== undefined && consultation.fee !== null ? String(consultation.fee) : '',
        medicines: (consultation.medicines || [{ name: '', dose: '', frequency: '', duration: '', quantity: '' }]).map(med => ({
          name: med.name || '',
          dose: (med as any).dose || '',
          frequency: (med as any).frequency || '',
          duration: (med as any).duration || '',
          quantity: (med as any).quantity || '',
        })),
      });
    } else {
      setSelectedConsultation(null);
      setFormData({
        appointmentId: 0,
        symptoms: '',
        diagnosis: '',
        prescription: '',
        notes: '',
        followUpDate: '',
        fee: '',
        medicines: [
          { name: '', dose: '', frequency: '', duration: '', quantity: '' }
        ],
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

  const handleMedicineChange = (idx: number, field: keyof ConsultationFormMedicine, value: string) => {
    const updated = [...formData.medicines];
    (updated[idx] as any)[field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const handleAddMedicine = () => {
    setFormData({ ...formData, medicines: [...formData.medicines, { name: '', dose: '', frequency: '', duration: '', quantity: '' }] });
  };

  const handleRemoveMedicine = (idx: number) => {
    const updated = formData.medicines.filter((_, i) => i !== idx);
    setFormData({ ...formData, medicines: updated });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        fee: formData.fee === '' ? 0 : Number(formData.fee),
        medicines: formData.medicines.filter(med => med.name.trim() !== '').map(med => ({
          name: med.name,
          dosage: med.dose,
          frequency: med.frequency,
          duration: med.duration,
          quantity: med.quantity ? Number(med.quantity) : undefined,
        })),
      };
      if (selectedConsultation) {
        await consultationService.updateConsultation(selectedConsultation.id, payload);
        setSuccess('Consultation updated successfully');
      } else {
        await consultationService.createConsultation(payload);
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

  const handleChangePage = (_: unknown, newPage: number) => {
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
            placeholder="Search consultations by Doctor Name .."
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
                <TableCell>Date/Time</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Symptoms</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Medicines</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(consultations || []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.consultationTime ? new Date(c.consultationTime).toLocaleString() : '-'}</TableCell>
                  <TableCell>{c.patientName}</TableCell>
                  <TableCell>{c.doctorName}</TableCell>
                  <TableCell>{c.symptoms}</TableCell>
                  <TableCell>{c.diagnosis}</TableCell>
                  <TableCell>{(c.medicines && c.medicines.length > 0) ? c.medicines.map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}${m.frequency ? `, Freq: ${m.frequency}` : ''}${m.duration ? `, Dur: ${m.duration}` : ''}`).join('; ') : '-'}</TableCell>
                  <TableCell>{c.followUpDate ? c.followUpDate : '-'}</TableCell>
                  <TableCell>{c.fee ?? '-'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(c, 'view')}><Visibility /></IconButton>
                    {canEdit && <IconButton size="small" onClick={() => handleOpenDialog(c, 'edit')}><Edit /></IconButton>}
                    {canDelete && <IconButton size="small" onClick={() => handleDelete(c)} color="error"><Delete /></IconButton>}
                    <IconButton size="small" color="primary" title="Download PDF" onClick={async () => {
                      try {
                        if (!c.patientId) throw new Error('No patientId');
                        const blob = await consultationService.downloadPatientHistoryPdf(c.patientId);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `consultation_${c.id}_patient_${c.patientId}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (e) {
                        alert('Failed to download PDF');
                      }
                    }}>
                      <PictureAsPdfIcon />
                    </IconButton>
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
                    if (!option) return '';
                    const patientName = option.patient && option.patient.name
                      ? option.patient.name
                      : `Unknown Patient (ID: ${option.patientId || option.id})`;
                    const doctorName = option.doctor && (option.doctor.firstName || option.doctor.username)
                      ? option.doctor.firstName
                        ? `Dr. ${option.doctor.firstName} ${option.doctor.lastName || ''}`.trim()
                        : `Dr. ${option.doctor.username}`
                      : '';
                    const date = option.appointmentDate
                      ? new Date(option.appointmentDate).toLocaleDateString()
                      : 'Unknown Date';
                    return `${patientName}${doctorName ? ' / ' + doctorName : ''} - ${date}`;
                  }}
                  isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
                  value={appointments.find(a => a.id === formData.appointmentId) || null}
                  onChange={(_, newValue) => {
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
                  label="Symptoms"
                  multiline
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  disabled={isViewing}
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
                  label="Prescription (General Notes)"
                  multiline
                  rows={2}
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  disabled={isViewing}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Medicines</Typography>
                {formData.medicines.map((med, idx) => {
                  const selectedMed = medicineList.find(m => m.name === med.name);
                  return (
                    <Grid container spacing={1} key={idx} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={3}>
                        <Autocomplete
                          freeSolo
                          options={medicineOptions}
                          value={med.name}
                          onInputChange={(_, newValue) => handleMedicineChange(idx, 'name', newValue)}
                          renderInput={(params) => (
                            <TextField {...params} label="Name" disabled={isViewing} fullWidth />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Dose"
                          value={med.dose}
                          onChange={e => handleMedicineChange(idx, 'dose', e.target.value)}
                          disabled={isViewing}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Frequency"
                          value={med.frequency}
                          onChange={e => handleMedicineChange(idx, 'frequency', e.target.value)}
                          disabled={isViewing}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Duration"
                          value={med.duration}
                          onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                          disabled={isViewing}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          label="Qty"
                          type="number"
                          value={med.quantity || ''}
                          onChange={e => handleMedicineChange(idx, 'quantity', e.target.value)}
                          disabled={isViewing}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          label="Price"
                          value={selectedMed && selectedMed.price ? `₹${selectedMed.price}` : ''}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        {!isViewing && (
                          <Button color="error" onClick={() => handleRemoveMedicine(idx)} disabled={formData.medicines.length === 1}>
                            Remove
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
                {!isViewing && (
                  <Button variant="outlined" onClick={handleAddMedicine} sx={{ mt: 1 }}>
                    Add Medicine
                  </Button>
                )}
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
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Consultation Fee"
                  type="number"
                  value={formData.fee}
                  onChange={e => setFormData({ ...formData, fee: e.target.value })}
                  disabled={isViewing}
                  fullWidth
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