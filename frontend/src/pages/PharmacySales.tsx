import React, { useEffect, useState } from 'react';
import { getSales, addSale, PharmacySale, PharmacySaleItem } from '../services/pharmacySalesService';
import { getMedicines, Medicine } from '../services/pharmacyService';
import { getBatches, PharmacyBatch } from '../services/pharmacyBatchService';
import { patientService } from '../services/patientService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';

const PharmacySales: React.FC = () => {
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<PharmacyBatch[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    patientId: '',
    saleDate: '',
    items: [
      { medicineId: '', batchId: '', quantity: '', price: '' }
    ],
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSales(),
      getMedicines(),
      getBatches(),
      patientService.getPatients()
    ])
      .then(([sales, meds, batches, pats]) => {
        setSales(sales);
        setMedicines(meds);
        setBatches(batches);
        setPatients(pats);
      })
      .catch(() => setError('Failed to fetch sales or related data'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOpen = () => {
    setAddForm({
      patientId: '',
      saleDate: new Date().toISOString().slice(0, 10),
      items: [{ medicineId: '', batchId: '', quantity: '', price: '' }],
    });
    setAddError(null);
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
    setAddError(null);
  };
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleItemChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const items = addForm.items.map((item, i) =>
      i === idx ? { ...item, [e.target.name]: e.target.value } : item
    );
    setAddForm({ ...addForm, items });
  };
  const handleAddItem = () => {
    setAddForm({ ...addForm, items: [...addForm.items, { medicineId: '', batchId: '', quantity: '', price: '' }] });
  };
  const handleRemoveItem = (idx: number) => {
    setAddForm({ ...addForm, items: addForm.items.filter((_, i) => i !== idx) });
  };
  const handleAddSubmit = async () => {
    setAddLoading(true);
    setAddError(null);
    try {
      const sale = await addSale({
        patientId: Number(addForm.patientId),
        saleDate: addForm.saleDate,
        items: addForm.items.map(item => ({
          medicineId: Number(item.medicineId),
          batchId: Number(item.batchId),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        totalAmount: addForm.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
      });
      setSales((prev) => [...prev, sale]);
      setOpenAdd(false);
    } catch (err) {
      setAddError('Failed to add sale');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Pharmacy Sales</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddOpen}>Add Sale</Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{patients.find(p => p.id === sale.patientId)?.name || sale.patientId}</TableCell>
                  <TableCell>{sale.saleDate}</TableCell>
                  <TableCell>
                    {sale.items.map((item, idx) => (
                      <div key={item.id || idx}>
                        {medicines.find(m => m.id === item.medicineId)?.name || item.medicineId} (Batch: {batches.find(b => b.id === item.batchId)?.batchNumber || item.batchId}) x {item.quantity} @ {item.price}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{sale.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Add Sale Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent>
          <TextField select margin="dense" label="Patient" name="patientId" value={addForm.patientId} onChange={handleAddChange} fullWidth required>
            {patients.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name || p.firstName + ' ' + p.lastName}</MenuItem>
            ))}
          </TextField>
          <TextField margin="dense" label="Date" name="saleDate" value={addForm.saleDate} onChange={handleAddChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
          {addForm.items.map((item, idx) => (
            <Paper key={idx} sx={{ p: 2, my: 1, background: '#f9f9f9' }}>
              <Typography variant="subtitle2">Item {idx + 1}</Typography>
              <TextField select margin="dense" label="Medicine" name="medicineId" value={item.medicineId} onChange={e => handleItemChange(idx, e)} fullWidth required>
                {medicines.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                ))}
              </TextField>
              <TextField select margin="dense" label="Batch" name="batchId" value={item.batchId} onChange={e => handleItemChange(idx, e)} fullWidth required>
                {batches.filter(b => String(b.medicineId) === String(item.medicineId)).map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.batchNumber} (Exp: {b.expiryDate})</MenuItem>
                ))}
              </TextField>
              <TextField margin="dense" label="Quantity" name="quantity" value={item.quantity} onChange={e => handleItemChange(idx, e)} type="number" fullWidth required />
              <TextField margin="dense" label="Price" name="price" value={item.price} onChange={e => handleItemChange(idx, e)} type="number" fullWidth required />
              <Button onClick={() => handleRemoveItem(idx)} color="error" size="small" sx={{ mt: 1 }} disabled={addForm.items.length === 1}>Remove Item</Button>
            </Paper>
          ))}
          <Button onClick={handleAddItem} color="primary" size="small" sx={{ mt: 1 }}>Add Another Item</Button>
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add Sale'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PharmacySales;
