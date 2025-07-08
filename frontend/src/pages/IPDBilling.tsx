import React, { useState, useEffect } from 'react';
import { getConsolidatedIPDBill, finalizeConsolidatedIPDBill, Bill } from '../services/billingService';
import { ipdService } from '../services/ipdService';
import { Autocomplete } from '@mui/material';
import { TextField, Button, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';

const IPDBilling: React.FC = () => {
  const [admissionId, setAdmissionId] = useState('');
  const [admissions, setAdmissions] = useState<any[]>([]);
  useEffect(() => {
    ipdService.getAdmissions().then(setAdmissions);
  }, []);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalized, setFinalized] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ description: '', amount: '' });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editField, setEditField] = useState<'description' | 'amount' | null>(null);
  const [editValue, setEditValue] = useState('');

  // New state for editable admission fields
  const [editAdmissionFields, setEditAdmissionFields] = useState({
    discharge_date: '',
    discharge_summary: '',
    discharge_time: '',
    total_bill: '',
    bed_id: '',
  });

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
      // Collect custom items from bill.items
      const customItems = (bill?.items || []).map(item => ({
        description: item.description,
        amount: Number(item.amount)
      }));
      const res = await finalizeConsolidatedIPDBill(Number(admissionId), customItems);
      setBill(res.data as Bill);
      setFinalized(true);
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to finalize bill');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBillItem = () => {
    if (!bill) return;
    if (!newItem.description.trim() || !newItem.amount || isNaN(Number(newItem.amount))) return;
    const updatedItems = [...(bill.items || []), { description: newItem.description, amount: Number(newItem.amount) }];
    const updatedBill = { ...bill, items: updatedItems, totalAmount: (bill.totalAmount || 0) + Number(newItem.amount) };
    setBill(updatedBill);
    setAddDialogOpen(false);
    setNewItem({ description: '', amount: '' });
  };

  const handleEditCell = (idx: number, field: 'description' | 'amount', value: string | number | null) => {
    setEditIdx(idx);
    setEditField(field);
    setEditValue(value == null ? '' : String(value));
  };

  const handleSaveEdit = () => {
    if (bill && editIdx !== null && editField) {
      const updatedItems = bill.items.map((item, idx) => {
        if (idx === editIdx) {
          return {
            ...item,
            [editField]: editField === 'amount' ? Number(editValue) : editValue,
          };
        }
        return item;
      });
      // Recalculate total
      const totalAmount = updatedItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setBill({ ...bill, items: updatedItems, totalAmount });
    }
    setEditIdx(null);
    setEditField(null);
    setEditValue('');
  };

  // Update admission fields when a new admission is selected
  useEffect(() => {
    if (admissionId && admissions.length > 0) {
      const admission = admissions.find(a => String(a.id) === String(admissionId));
      setEditAdmissionFields({
        discharge_date: admission?.discharge_date || '',
        discharge_summary: admission?.discharge_summary || '',
        discharge_time: admission?.discharge_time || '',
        total_bill: admission?.total_bill != null ? String(admission.total_bill) : '',
        bed_id: admission?.bed?.id != null ? String(admission.bed.id) : '',
      });
    }
  }, [admissionId, admissions]);

  // Handler to update admission fields in the UI and (optionally) backend
  const handleAdmissionFieldChange = (field: string, value: string) => {
    setEditAdmissionFields(prev => ({ ...prev, [field]: value }));
  };

  // Update admission in backend and local state
  const handleUpdateAdmission = async () => {
    if (!admissionId) return;
    setLoading(true);
    setError(null);
    try {
      // Prepare request body
      const req = {
        dischargeDate: editAdmissionFields.discharge_date ? new Date(editAdmissionFields.discharge_date) : null,
        dischargeSummary: editAdmissionFields.discharge_summary,
        dischargeTime: editAdmissionFields.discharge_time,
        totalBill: editAdmissionFields.total_bill ? Number(editAdmissionFields.total_bill) : null,
        bedId: editAdmissionFields.bed_id ? Number(editAdmissionFields.bed_id) : null,
      };
      const updated = await ipdService.updateAdmission(Number(admissionId), req);
      setAdmissions(prev => prev.map(a => String(a.id) === String(admissionId) ? { ...a, ...updated } : a));
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to update admission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>IPD Consolidated Billing</Typography>
      <Autocomplete
        options={admissions}
        getOptionLabel={adm => adm && adm.id ? `#${adm.id} - ${adm.patient?.name || 'Unknown'} (${adm.admissionDate?.slice(0,10)})` : ''}
        value={admissions.find(a => a.id === Number(admissionId)) || null}
        onChange={(_, newValue) => setAdmissionId(newValue ? String(newValue.id) : '')}
        renderInput={params => (
          <TextField {...params} label="Admission" sx={{ mr: 2 }} />
        )}
        sx={{ width: 300, mr: 2 }}
      />
      <Button variant="contained" onClick={handlePreview} disabled={loading || !admissionId}>Preview Bill</Button>
      {loading && <CircularProgress sx={{ ml: 2 }} size={24} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {bill && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="h6">Bill Summary</Typography>
          {/* Editable Admission Fields */}
           
          <Button variant="outlined" sx={{ mb: 2 }} onClick={() => setAddDialogOpen(true)}>
            Add Bill Item
          </Button>
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
                  <TableCell onClick={() => (item.description == null || item.description === '') ? handleEditCell(idx, 'description', item.description) : undefined} sx={{ cursor: (item.description == null || item.description === '') ? 'pointer' : 'default' }}>
                    {editIdx === idx && editField === 'description' ? (
                      <TextField
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); }}
                        size="small"
                        autoFocus
                      />
                    ) : (
                      item.description == null || item.description === '' ? <span style={{ color: '#aaa' }}>[Click to add]</span> : item.description
                    )}
                  </TableCell>
                  <TableCell onClick={() => (item.amount == null) ? handleEditCell(idx, 'amount', item.amount) : undefined} sx={{ cursor: (item.amount == null) ? 'pointer' : 'default' }}>
                    {editIdx === idx && editField === 'amount' ? (
                      <TextField
                        value={editValue}
                        type="number"
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); }}
                        size="small"
                        autoFocus
                      />
                    ) : (
                      item.amount == null ? <span style={{ color: '#aaa' }}>[Click to add]</span> : item.amount
                    )}
                  </TableCell>
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
          {/* Add Bill Item Dialog */}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
            <DialogTitle>Add Bill Item</DialogTitle>
            <DialogContent>
              <TextField
                label="Description"
                value={newItem.description}
                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Amount"
                type="number"
                value={newItem.amount}
                onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBillItem} variant="contained" disabled={!newItem.description.trim() || !newItem.amount || isNaN(Number(newItem.amount))}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Paper>
  );
};
export default IPDBilling;
