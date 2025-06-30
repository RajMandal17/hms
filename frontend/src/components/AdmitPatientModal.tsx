import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Grid, CircularProgress, Alert
} from '@mui/material';
import { patientService } from '../services/patientService';
import { doctorService } from '../services/doctorService';
import { ipdService } from '../services/ipdService';

interface AdmitPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({ open, onClose, onSuccess }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    wardId: '',
    bedId: '',
    attendantName: '',
    attendantContact: '',
    admissionNotes: '',
    insuranceDetails: '',
    initialDeposit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      patientService.getPatients().then(setPatients);
      doctorService.getDoctors().then(setDoctors);
      ipdService.getWards().then(setWards);
    }
  }, [open]);

  const refreshBeds = () => {
    if (form.wardId) {
      ipdService.getAvailableBedsByWard(form.wardId).then(setBeds);
    } else {
      setBeds([]);
    }
  };

  useEffect(() => {
    refreshBeds();
    // eslint-disable-next-line
  }, [form.wardId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await ipdService.admitPatient({
        ...form,
        initialDeposit: Number(form.initialDeposit),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admission failed');
      refreshBeds(); // Auto-refresh beds on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Admit Patient</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select label="Patient" name="patientId" value={form.patientId}
                onChange={handleChange} fullWidth required
              >
                {patients.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name ? p.name : `${p.firstName || ''} ${p.lastName || ''}`} (ID: {p.id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select label="Doctor" name="doctorId" value={form.doctorId}
                onChange={handleChange} fullWidth required
              >
                {doctors.map(d => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name ? d.name : `Dr. ${d.firstName || ''} ${d.lastName || ''}`} (ID: {d.id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select label="Ward" name="wardId" value={form.wardId}
                onChange={handleChange} fullWidth required
              >
                {wards.map(w => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name} ({w.type})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select label="Bed" name="bedId" value={form.bedId}
                onChange={handleChange} fullWidth required
                disabled={!form.wardId}
              >
                {beds.map(b => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.bedNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Attendant Name" name="attendantName" value={form.attendantName}
                onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Attendant Contact" name="attendantContact" value={form.attendantContact}
                onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Admission Notes" name="admissionNotes" value={form.admissionNotes}
                onChange={handleChange} fullWidth multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Insurance Details" name="insuranceDetails" value={form.insuranceDetails}
                onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Initial Deposit (₹)" name="initialDeposit" value={form.initialDeposit}
                onChange={handleChange} fullWidth required type="number" />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Admit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
