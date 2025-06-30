import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { ipdService } from '../services/ipdService';
import { doctorRoundService } from '../services/doctorRoundService';

interface AddDoctorRoundModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddDoctorRoundModal: React.FC<AddDoctorRoundModalProps> = ({ open, onClose, onSuccess }) => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [admissionId, setAdmissionId] = useState('');
  const [notes, setNotes] = useState('');
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
      await doctorRoundService.addDoctorRound({
        admissionId,
        notes,
        timestamp: new Date().toISOString(),
      });
      if (onSuccess) onSuccess();
      onClose();
      setAdmissionId(''); setNotes('');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to add doctor round');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Doctor Round</DialogTitle>
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
          <TextField label="Notes" multiline minRows={3} value={notes} onChange={e => setNotes(e.target.value)} fullWidth />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !admissionId || !notes}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
