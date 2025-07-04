import React, { useState } from 'react';
import { getConsolidatedIPDBill, finalizeConsolidatedIPDBill, Bill } from '../services/billingService';
import { TextField, Button, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';

const IPDBilling: React.FC = () => {
  const [admissionId, setAdmissionId] = useState('');
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalized, setFinalized] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    setFinalized(false);
    try {
      const res = await getConsolidatedIPDBill(Number(admissionId));
      setBill(res.data as Bill);
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to fetch bill');
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await finalizeConsolidatedIPDBill(Number(admissionId));
      setBill(res.data as Bill);
      setFinalized(true);
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to finalize bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>IPD Consolidated Billing</Typography>
      <TextField label="Admission ID" value={admissionId} onChange={e => setAdmissionId(e.target.value)} type="number" sx={{ mr: 2 }} />
      <Button variant="contained" onClick={handlePreview} disabled={loading || !admissionId}>Preview Bill</Button>
      {loading && <CircularProgress sx={{ ml: 2 }} size={24} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {bill && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="h6">Bill Summary</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.items?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>{bill.totalAmount}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography sx={{ mt: 2 }}>Status: <b>{bill.status}</b></Typography>
          <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleFinalize} disabled={finalized || bill.status === 'FINALIZED'}>
            {finalized || bill.status === 'FINALIZED' ? 'Finalized' : 'Finalize Bill'}
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default IPDBilling;
