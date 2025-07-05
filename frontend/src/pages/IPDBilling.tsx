import React, { useState, useEffect } from 'react';
import { getConsolidatedIPDBill, finalizeConsolidatedIPDBill, Bill, addBillItem, updateBillItem, deleteBillItem, BillItem } from '../services/billingService';
import { ipdService } from '../services/ipdService';
import { TextField, Button, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar, Alert, Autocomplete, Box } from '@mui/material';

interface Admission {
  id: number;
  patientName: string;
  wardName?: string;
  bedNumber?: string;
  admissionDate?: string;
}

const IPDBilling: React.FC = () => {
  const [admissionId, setAdmissionId] = useState<number | null>(null);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalized, setFinalized] = useState(false);
  const [success, setSuccess] = useState(false);

  // Add state for editing
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmt, setEditAmt] = useState<number | ''>('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmt, setNewAmt] = useState<number | ''>('');

  useEffect(() => {
    ipdService.getAdmissions().then((data: any[]) => {
      // Map backend admissions to Admission type (using patientName directly)
      setAdmissions(
        data.map((adm: any) => ({
          id: adm.id,
          patientName: adm.patientName || 'Unknown',
          wardName: adm.wardName || '',
          bedNumber: adm.bedNumber || '',
          admissionDate: adm.admissionDate || adm.createdAt || '',
        }))
      );
    });
  }, []);

  const handlePreview = async () => {
    if (!admissionId) return;
    setLoading(true);
    setError(null);
    setFinalized(false);
    setSuccess(false);
    try {
      const res = await getConsolidatedIPDBill(Number(admissionId));
      setBill(res.data as Bill);
    } catch (e: any) {
      setError(e?.response?.data || e?.message || 'Failed to fetch bill');
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!admissionId) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await finalizeConsolidatedIPDBill(Number(admissionId));
      setBill(res.data as Bill);
      setFinalized(true);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data || e?.message || 'Failed to finalize bill');
    } finally {
      setLoading(false);
    }
  };

  // Add new bill item
  const handleAddItem = async () => {
    if (!bill?.id || !newDesc || !newAmt) return;
    try {
      const res = await addBillItem(bill.id, { description: newDesc, amount: Number(newAmt) });
      setBill(res.data as Bill);
      setNewDesc('');
      setNewAmt('');
    } catch (e) { setError('Failed to add item'); }
  };

  // Start editing
  const startEdit = (idx: number, item: BillItem) => {
    setEditIdx(idx);
    setEditDesc(item.description);
    setEditAmt(item.amount);
  };

  // Save edit
  const handleEditSave = async (item: BillItem) => {
    if (!item.id || !bill?.id) return;
    try {
      const res = await updateBillItem(item.id, { ...item, description: editDesc, amount: Number(editAmt) });
      setBill(res.data as Bill);
      setEditIdx(null);
    } catch (e) { setError('Failed to update item'); }
  };

  // Delete item
  const handleDelete = async (item: BillItem) => {
    if (!item.id || !bill?.id) return;
    try {
      const res = await deleteBillItem(item.id);
      setBill(res.data as Bill);
    } catch (e) { setError('Failed to delete item'); }
  };

  const selectedAdmission = admissions.find(a => a.id === admissionId);

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>IPD Consolidated Billing</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Autocomplete
          options={admissions}
          getOptionLabel={option => `${option.patientName} (ID: ${option.id})`}
          value={admissions.find(a => a.id === admissionId) || null}
          onChange={(_, value) => setAdmissionId(value ? value.id : null)}
          sx={{ width: 320, mr: 2 }}
          renderInput={params => <TextField {...params} label="Select Admission" />}
        />
        <Button variant="contained" onClick={handlePreview} disabled={loading || !admissionId}>Preview Bill</Button>
        {loading && <CircularProgress sx={{ ml: 2 }} size={24} />}
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {bill && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="h6">Bill Summary</Typography>
          {selectedAdmission && (
            <Box sx={{ mb: 2 }}>
              <Typography>Patient: <b>{selectedAdmission.patientName}</b></Typography>
              <Typography>Ward: <b>{selectedAdmission.wardName}</b> | Bed: <b>{selectedAdmission.bedNumber}</b></Typography>
              <Typography>Admission Date: <b>{selectedAdmission.admissionDate?.slice(0, 10)}</b></Typography>
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.items?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {editIdx === idx ? (
                      <TextField size="small" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                    ) : (
                      item.description
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editIdx === idx ? (
                      <TextField size="small" type="number" value={editAmt} onChange={e => setEditAmt(e.target.value === '' ? '' : Number(e.target.value))} />
                    ) : (
                      item.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editIdx === idx ? (
                      <>
                        <Button size="small" color="primary" onClick={() => handleEditSave(item)}>Save</Button>
                        <Button size="small" color="inherit" onClick={() => setEditIdx(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" color="primary" onClick={() => startEdit(idx, item)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(item)}>Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField size="small" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </TableCell>
                <TableCell align="right">
                  <TextField size="small" type="number" placeholder="Amount" value={newAmt} onChange={e => setNewAmt(e.target.value === '' ? '' : Number(e.target.value))} />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" color="success" onClick={handleAddItem} disabled={!newDesc || !newAmt}>Add</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Total</b></TableCell>
                <TableCell align="right"><b>{bill.totalAmount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</b></TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
          <Typography sx={{ mt: 2 }}>Status: <b>{bill.status}</b></Typography>
          <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleFinalize} disabled={finalized || bill.status === 'FINALIZED'}>
            {finalized || bill.status === 'FINALIZED' ? 'Finalized' : 'Finalize Bill'}
          </Button>
        </div>
      )}
      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Bill finalized successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default IPDBilling;
