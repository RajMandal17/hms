import React, { useEffect, useState } from 'react';
import { getPendingPrescriptions, fulfillPrescription, PendingPrescriptionDTO, FulfillPrescriptionPayload, getPrescriptionDetails } from '../services/pharmacySalesService';
import { getBatches, PharmacyBatch } from '../services/pharmacyBatchService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const PendingPrescriptions: React.FC = () => {
  const [pending, setPending] = useState<PendingPrescriptionDTO[]>([]);
  const [selected, setSelected] = useState<PendingPrescriptionDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [fulfillForm, setFulfillForm] = useState({ batchId: '', quantity: '', paymentMode: 'CASH' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<PharmacyBatch[]>([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState<any>(null);

  useEffect(() => {
    fetchPending();
    getBatches().then(setBatches);
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      setPending(await getPendingPrescriptions());
    } catch {
      setError('Failed to fetch pending prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFulfill = async (presc: PendingPrescriptionDTO) => {
    setSelected(presc);
    setFulfillForm({ batchId: '', quantity: '', paymentMode: 'CASH' });
    setOpen(true);
    setError(null);
    setPrescriptionDetails(null);
    try {
      const details = await getPrescriptionDetails(presc.id, presc.type);
      setPrescriptionDetails(details);
    } catch {
      setPrescriptionDetails(null);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setError(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFulfillForm(f => ({ ...f, [name!]: value }));
  };
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFulfillForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const payload: FulfillPrescriptionPayload = {
        prescriptionId: selected.id,
        patientId: selected.patientId,
        saleType: selected.type,
        paymentMode: fulfillForm.paymentMode,
        items: [{ batchId: Number(fulfillForm.batchId), quantity: Number(fulfillForm.quantity) }],
      };
      await fulfillPrescription(payload);
      handleClose();
      fetchPending();
    } catch {
      setError('Failed to fulfill prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pending Prescriptions</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pending.map(presc => (
              <TableRow key={presc.id}>
                <TableCell>{presc.id}</TableCell>
                <TableCell>{presc.type}</TableCell>
                <TableCell>{presc.doctorName || presc.doctorId}</TableCell>
                <TableCell>{presc.status}</TableCell>
                <TableCell>{presc.createdAt}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleOpenFulfill(presc)} disabled={loading}>
                    Fulfill
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Fulfill Prescription</DialogTitle>
        <DialogContent>
          {prescriptionDetails && (
            <div style={{ marginBottom: 16 }}>
              <strong>Prescription Details:</strong>
              {prescriptionDetails.medicinesJson && (
                <pre>{prescriptionDetails.medicinesJson}</pre>
              )}
              {prescriptionDetails.medicines && Array.isArray(prescriptionDetails.medicines) && (
                <ul>
                  {prescriptionDetails.medicines.map((m: any, idx: number) => (
                    <li key={idx}>{m.medicineName} - {m.dosage} - Qty: {m.quantity}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Batch ID</InputLabel>
            <Select
              name="batchId"
              value={fulfillForm.batchId}
              onChange={handleSelectChange}
              label="Batch ID"
            >
              {batches.map(batch => (
                <MenuItem key={batch.id} value={batch.id}>
                  {batch.batchNumber} (Stock: {batch.stock})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Quantity"
            name="quantity"
            value={fulfillForm.quantity}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Mode</InputLabel>
            <Select
              name="paymentMode"
              value={fulfillForm.paymentMode}
              onChange={handleSelectChange}
              label="Payment Mode"
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CARD">Card</MenuItem>
              <MenuItem value="INSURANCE">Insurance</MenuItem>
            </Select>
          </FormControl>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Fulfill
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PendingPrescriptions;
