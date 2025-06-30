import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { ipdService } from '../services/ipdService';

export const AddWardModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', type: '', bedCount: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await ipdService.addWard({ ...form, bedCount: Number(form.bedCount) });
    setLoading(false);
    onSuccess && onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Ward</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
        <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth required />
        <TextField label="Bed Count" name="bedCount" value={form.bedCount} onChange={handleChange} fullWidth required type="number" inputProps={{ min: 1 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};
