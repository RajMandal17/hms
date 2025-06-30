import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { ipdService } from '../services/ipdService';
import { vitalsService } from '../services/vitalsService';

interface AddVitalsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddVitalsModal: React.FC<AddVitalsModalProps> = ({ open, onClose, onSuccess }) => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [admissionId, setAdmissionId] = useState('');
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      ipdService.getAdmissions()
        .then((data: any[]) => setAdmissions(data))
        .catch(() => setAdmissions([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await vitalsService.addVitals({
        admissionId,
        bp,
        pulse: pulse ? Number(pulse) : null,
        temperature: temperature ? Number(temperature) : null,
        timestamp: new Date().toISOString(),
      });
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setAdmissionId(''); setBp(''); setPulse(''); setTemperature('');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to add vitals');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Nursing Vitals</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {loading ? <CircularProgress /> : (
            <FormControl fullWidth>
              <InputLabel id="admission-label">Admitted Patient</InputLabel>
              <Select
                labelId="admission-label"
                value={admissionId}
                label="Admitted Patient"
                onChange={e => setAdmissionId(e.target.value)}
              >
                {admissions.map((adm) => (
                  <MenuItem key={adm.id} value={adm.id}>
                    {adm.patientId ? `Patient #${adm.patientId}` : `Admission #${adm.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField label="Blood Pressure (BP)" value={bp} onChange={e => setBp(e.target.value)} fullWidth />
          <TextField label="Pulse" type="number" value={pulse} onChange={e => setPulse(e.target.value)} fullWidth />
          <TextField label="Temperature (°C)" type="number" value={temperature} onChange={e => setTemperature(e.target.value)} fullWidth />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !admissionId || !bp}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
