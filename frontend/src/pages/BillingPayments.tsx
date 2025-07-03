import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { recordPayment, getPaymentsByPatient, Payment } from '../services/paymentService';

const paymentModes = ['Cash', 'Card', 'UPI', 'Other'];

const BillingPayments: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [reference, setReference] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecord = async () => {
    setError(''); setSuccess('');
    if (!patientId || !amount) {
      setError('Patient ID and amount are required');
      return;
    }
    setLoading(true);
    try {
      await recordPayment({ patientId: Number(patientId), amount: Number(amount), mode, reference });
      setSuccess('Payment recorded');
      setAmount(''); setReference('');
      handleFetch();
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    setError(''); setSuccess('');
    if (!patientId) {
      setError('Enter Patient ID to fetch payments');
      return;
    }
    setLoading(true);
    try {
      const res = await getPaymentsByPatient(Number(patientId));
      setPayments(res.data);
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Record Payment</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} size="small" type="number" />
        <TextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} size="small" type="number" />
        <TextField select label="Mode" value={mode} onChange={e => setMode(e.target.value)} size="small">
          {paymentModes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField label="Reference" value={reference} onChange={e => setReference(e.target.value)} size="small" />
      </Box>
      <Button variant="contained" onClick={handleRecord} disabled={loading}>Record Payment</Button>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" mb={1}>Payment History</Typography>
      <Button variant="outlined" onClick={handleFetch} size="small" sx={{ mb: 2 }} disabled={loading}>Fetch Payments</Button>
      <List>
        {payments.map((p) => (
          <ListItem key={p.id} divider>
            <ListItemText
              primary={`₹${p.amount} - ${p.mode} (${p.status})`}
              secondary={`Paid At: ${p.paidAt || '-'}${p.reference ? ' | Ref: ' + p.reference : ''}`}
            />
          </ListItem>
        ))}
        {payments.length === 0 && <Typography variant="body2" color="text.secondary">No payments found.</Typography>}
      </List>
    </Box>
  );
};

export default BillingPayments;
