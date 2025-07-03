import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, MenuItem, Alert } from '@mui/material';
import { pharmacyReturnService, PharmacyReturn } from '../services/pharmacyReturnService';

const refundModes = ['Cash', 'Card', 'UPI', 'Credit Note'];

const PharmacyReturns: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [billId, setBillId] = useState('');
  const [medicine, setMedicine] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [refundMode, setRefundMode] = useState('Cash');
  const [returns, setReturns] = useState<PharmacyReturn[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAddReturn = () => {
    setError(''); setSuccess('');
    if (!patientId || !billId || !medicine || !quantity || !amount || !reason) {
      setError('All fields are required');
      return;
    }
    const newReturn: PharmacyReturn = {
      id: Math.random().toString(36).substr(2, 9),
      billId: Number(billId),
      patientId: Number(patientId),
      medicine,
      quantity: Number(quantity),
      amount: Number(amount),
      date: new Date().toISOString(),
      reason,
      refundMode,
    };
    pharmacyReturnService.add(newReturn);
    setSuccess('Return recorded');
    setMedicine(''); setQuantity(''); setAmount(''); setReason('');
    handleFetchReturns();
  };

  const handleFetchReturns = () => {
    setError(''); setSuccess('');
    if (!patientId) {
      setError('Enter Patient ID to fetch returns');
      return;
    }
    setReturns(pharmacyReturnService.getByPatient(Number(patientId)));
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Pharmacy Returns & Refunds</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} size="small" type="number" />
        <TextField label="Bill ID" value={billId} onChange={e => setBillId(e.target.value)} size="small" type="number" />
        <TextField label="Medicine" value={medicine} onChange={e => setMedicine(e.target.value)} size="small" />
        <TextField label="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} size="small" type="number" />
        <TextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} size="small" type="number" />
      </Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Reason" value={reason} onChange={e => setReason(e.target.value)} size="small" />
        <TextField select label="Refund Mode" value={refundMode} onChange={e => setRefundMode(e.target.value)} size="small">
          {refundModes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={handleAddReturn}>Add Return</Button>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" mb={1}>Return History</Typography>
      <Button variant="outlined" onClick={handleFetchReturns} size="small" sx={{ mb: 2 }}>Fetch Returns</Button>
      <List>
        {returns.map(r => (
          <ListItem key={r.id} divider>
            <ListItemText
              primary={`₹${r.amount} - ${r.medicine} x${r.quantity} (${r.refundMode})`}
              secondary={`Returned At: ${r.date.slice(0, 16).replace('T', ' ')} | Reason: ${r.reason}`}
            />
          </ListItem>
        ))}
        {returns.length === 0 && <Typography variant="body2" color="text.secondary">No returns found.</Typography>}
      </List>
    </Box>
  );
};

export default PharmacyReturns;
