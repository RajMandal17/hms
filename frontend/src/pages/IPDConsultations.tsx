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
  Autocomplete,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Consultation, Medicine } from '../types';
import { ipdConsultationService } from '../services/ipdConsultationService';
import { ipdAppointmentService } from '../services/ipdAppointmentService';
import { useAuth } from '../contexts/AuthContext';
import { getMedicines } from '../services/pharmacyService';

// --- Types for Consultation Form Medicines ---
interface ConsultationFormMedicine {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  quantity?: string | number;
  total?: string | number;
}


const IPDConsultations: React.FC = () => {
  const { hasAnyRole } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<string>('');
  const [selectedAdmissionObj, setSelectedAdmissionObj] = useState<any | null>(null);
  const [medicineOptions, setMedicineOptions] = useState<string[]>([]);
  const [medicineList, setMedicineList] = useState<Medicine[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [formData, setFormData] = useState({
    admissionId: '',
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    followUpDate: '',
    fee: '',
    medicines: [
      { name: '', dose: '', frequency: '', duration: '', quantity: '', total: '' }
    ] as ConsultationFormMedicine[],
    patientName: '',
    patientId: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const canEdit = hasAnyRole(['ADMIN', 'DOCTOR']);
  const canDelete = hasAnyRole(['ADMIN']);

  useEffect(() => {
    setAdmissionsLoading(true);
    ipdAppointmentService.getAdmissions().then(data => {
      setAdmissions(data);
      setAdmissionsLoading(false);
    });
    getMedicines().then(meds => {
      setMedicineOptions(meds.map(m => m.name));
      setMedicineList(meds);
    });
  }, []);

  useEffect(() => {
    if (selectedAdmission) {
      const found = admissions.find(a => String(a.id) === String(selectedAdmission));
      setSelectedAdmissionObj(found || null);
      loadConsultations();
    } else {
      setSelectedAdmissionObj(null);
      setConsultations([]);
      setTotalCount(0);
    }
  }, [selectedAdmission, admissions, page, rowsPerPage]);

  const loadConsultations = async () => {
    try {
      // For now, fetch all consultations for the selected admission
      const data = await ipdConsultationService.getConsultationsByAdmissionId(selectedAdmission);
      setConsultations(data);
      setTotalCount(data.length);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consultations');
    }
  };

  const handleOpenDialog = (consultation?: Consultation, mode: 'create' | 'edit' | 'view' = 'create') => {
    setFormErrors({});
    if (consultation) {
      setSelectedConsultation(consultation);
      setFormData({
        admissionId: (consultation as any).admissionId || selectedAdmission,
        symptoms: consultation.symptoms || '',
        diagnosis: consultation.diagnosis || '',
        prescription: consultation.prescription || '',
        notes: consultation.notes || '',
        followUpDate: consultation.followUpDate || '',
        fee: consultation.fee !== undefined && consultation.fee !== null ? String(consultation.fee) : '',
        medicines: (consultation.medicines || [{ name: '', dose: '', frequency: '', duration: '', quantity: '', total: '' }]).map(med => ({
          name: med.name || '',
          dose: (med as any).dose || '',
          frequency: (med as any).frequency || '',
          duration: (med as any).duration || '',
          quantity: (med as any).quantity || '',
          total: (med as any).total || '',
        })),
        patientName: consultation.patientName || selectedAdmissionObj?.patient?.name || '',
        patientId: consultation.patientId || selectedAdmissionObj?.patient?.id || '',
      });
    } else {
      setSelectedConsultation(null);
      setFormData({
        admissionId: selectedAdmission,
        symptoms: '',
        diagnosis: '',
        prescription: '',
        notes: '',
        followUpDate: '',
        fee: '',
        medicines: [
          { name: '', dose: '', frequency: '', duration: '', quantity: '', total: '' }
        ],
        patientName: selectedAdmissionObj?.patient?.name || '',
        patientId: selectedAdmissionObj?.patient?.id || '',
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
    if (field === 'name') {
      updated[idx].name = value;
      // Autofill dose/frequency if found in medicineList
      const medObj = medicineList.find(m => m.name === value);
      if (medObj) {
        if (medObj.dose) updated[idx].dose = medObj.dose;
        if (medObj.frequency) updated[idx].frequency = medObj.frequency;
      }
    } else {
      (updated[idx] as any)[field] = value;
    }
    setFormData({ ...formData, medicines: updated });
  };

  const handleAddMedicine = () => {
    setFormData({ ...formData, medicines: [...formData.medicines, { name: '', dose: '', frequency: '', duration: '', quantity: '', total: '' }] });
  };

  const handleRemoveMedicine = (idx: number) => {
    const updated = formData.medicines.filter((_, i) => i !== idx);
    setFormData({ ...formData, medicines: updated });
  };

  // --- Validation ---
  const validateForm = () => {
    const errors: any = {};
    if (!formData.symptoms.trim()) errors.symptoms = 'Symptoms are required.';
    if (!formData.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required.';
    if (!formData.admissionId) errors.admissionId = 'Admission is required.';
    if (!formData.patientName) errors.patientName = 'Patient name is required.';
    if (!formData.medicines || formData.medicines.length === 0 || !formData.medicines.some(m => m.name.trim())) {
      errors.medicines = 'At least one medicine is required.';
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        admissionId: selectedAdmission,
        appointmentId: 0, // Not used for IPD, but required by type
        fee: formData.fee === '' ? 0 : Number(formData.fee),
        medicines: formData.medicines.filter(med => med.name.trim() !== '').map(med => ({
          name: med.name,
          dose: med.dose,
          frequency: med.frequency,
          duration: med.duration,
          quantity: med.quantity ? Number(med.quantity) : undefined,
          total: med.total ? Number(med.total) : undefined,
        })),
      };
      if (selectedConsultation) {
        await ipdConsultationService.updateConsultation(selectedConsultation.id, payload);
        setSuccess('Consultation updated successfully');
      } else {
        await ipdConsultationService.createConsultation(payload);
        setSuccess('Consultation created successfully');
      }
      handleCloseDialog();
      loadConsultations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (consultation: Consultation) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await ipdConsultationService.deleteConsultation(consultation.id);
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
        <Paper sx={{ mb: 3, p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Autocomplete
              options={admissions || []}
              getOptionLabel={adm => adm && adm.patient?.name ? `${adm.patient.name} (ID: ${adm.id})` : `Admission #${adm?.id}`}
              value={
                Array.isArray(admissions) && selectedAdmission
                  ? admissions.find(a => String(a.id) === String(selectedAdmission)) || null
                  : null
              }
              onChange={(_, newValue) => setSelectedAdmission(newValue ? String(newValue.id) : '')}
              renderInput={params => (
                <TextField {...params} label="Select Admission" sx={{ minWidth: 250 }} size="small" />
              )}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return String(option.id) === String(value.id);
              }}
              disabled={admissionsLoading || !Array.isArray(admissions) || admissions.length === 0}
            />
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                disabled={admissionsLoading || !selectedAdmission}
              >
                Add Consultation
              </Button>
            )}
          </Box>
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
              {(consultations || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
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
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Admission ID"
                  value={formData.admissionId}
                  fullWidth
                  disabled
                  error={!!formErrors.admissionId}
                  helperText={formErrors.admissionId}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Patient Name"
                  value={formData.patientName || (selectedAdmissionObj?.patient?.name || '')}
                  fullWidth
                  disabled
                  error={!!formErrors.patientName}
                  helperText={formErrors.patientName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                {/* Show more patient/admission details */}
                <TextField
                  label="Patient Details"
                  value={selectedAdmissionObj ? `${selectedAdmissionObj.patient?.gender || ''}${selectedAdmissionObj.patient?.age ? ', Age: ' + selectedAdmissionObj.patient.age : ''}${selectedAdmissionObj.admissionDate ? ', Admitted: ' + dayjs(selectedAdmissionObj.admissionDate).format('YYYY-MM-DD') : ''}` : ''}
                  fullWidth
                  disabled
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
                  error={!!formErrors.symptoms}
                  helperText={formErrors.symptoms}
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
                  error={!!formErrors.diagnosis}
                  helperText={formErrors.diagnosis}
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
                          label="Total"
                          type="number"
                          value={med.total || ''}
                          onChange={e => handleMedicineChange(idx, 'total', e.target.value)}
                          disabled={isViewing}
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
                {formErrors.medicines && (
                  <Typography color="error" variant="body2">{formErrors.medicines}</Typography>
                )}
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
            {loading && <Typography sx={{ mt: 2 }} color="primary">Saving...</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              {isViewing ? 'Close' : 'Cancel'}
            </Button>
            {!isViewing && (
              <Button onClick={handleSave} variant="contained" disabled={loading}>
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

export default IPDConsultations;
