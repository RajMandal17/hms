import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { ipdService } from '../services/ipdService';

export const AddBedModal = ({ open, onClose, onSuccess }) => {
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({ wardId: '', bedNumber: '', status: 'VACANT' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) ipdService.getWards().then(setWards);
  }, [open]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await ipdService.addBed({ ...form, wardId: Number(form.wardId) });
    setLoading(false);
    onSuccess && onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Bed</DialogTitle>
      <DialogContent>
        <TextField
          select label="Ward" name="wardId" value={form.wardId} onChange={handleChange} fullWidth required
        >
          {wards.map(w => (
            <MenuItem key={w.id} value={w.id}>{w.name} ({w.type})</MenuItem>
          ))}
        </TextField>
        <TextField label="Bed Number" name="bedNumber" value={form.bedNumber} onChange={handleChange} fullWidth required />
        <TextField
          select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth required
        >
          <MenuItem value="VACANT">VACANT</MenuItem>
          <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
          <MenuItem value="CLEANING">CLEANING</MenuItem>
          <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};
