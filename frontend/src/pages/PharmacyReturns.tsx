import React, { useEffect, useState } from 'react';
import { getSales, PharmacySale } from '../services/pharmacySalesService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios';

const PharmacyReturns: React.FC = () => {
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({ saleId: '', saleItemId: '', quantity: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSales().then(setSales);
  }, []);

  const handleOpen = (sale: PharmacySale, item: any) => {
    setSelected({ sale, item });
    setReturnForm({ saleId: sale.id, saleItemId: item.id, quantity: '' });
    setOpen(true);
    setError(null);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setError(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/pharmacy/sales/return', null, {
        params: {
          saleId: returnForm.saleId,
          saleItemId: returnForm.saleItemId,
          quantity: returnForm.quantity,
        },
      });
      handleClose();
      setSales(await getSales());
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Return failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pharmacy Returns</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sale ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Return</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.flatMap(sale =>
              (sale.items || []).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.patientId}</TableCell>
                  <TableCell>{item.medicineBatch?.medicine?.name || ''}</TableCell>
                  <TableCell>{item.medicineBatch?.batchNumber || ''}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleOpen(sale, item)} disabled={loading}>
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Process Return</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Quantity to Return"
            name="quantity"
            value={returnForm.quantity}
            onChange={handleChange}
            fullWidth
            type="number"
            inputProps={{ min: 1, max: selected?.item?.quantity || 1 }}
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Return
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PharmacyReturns;
