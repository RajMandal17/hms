import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { addMedicine } from '../services/pharmacyService';

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !manufacturer || !unit || !price) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addMedicine({
        name,
        manufacturer,
        unit,
        price: parseFloat(price),
        category: '',
        description: '',
        stock: 0,
        expiryDate: '',
      });
      setName('');
      setManufacturer('');
      setUnit('');
      setPrice('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Medicine</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField label="Manufacturer" value={manufacturer} onChange={e => setManufacturer(e.target.value)} fullWidth />
          <TextField label="Unit" value={unit} onChange={e => setUnit(e.target.value)} fullWidth />
          <TextField label="Price" value={price} onChange={e => setPrice(e.target.value)} type="number" fullWidth />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};
