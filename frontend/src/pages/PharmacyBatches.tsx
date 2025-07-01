import React, { useEffect, useState } from 'react';
import { getBatches, addBatch, updateBatch, deleteBatch, PharmacyBatch } from '../services/pharmacyBatchService';
import { getMedicines, Medicine } from '../services/pharmacyService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PharmacyBatches: React.FC = () => {
  const [batches, setBatches] = useState<PharmacyBatch[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    medicineId: '',
    batchNumber: '',
    expiryDate: '',
    stock: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    medicineId: '',
    batchNumber: '',
    expiryDate: '',
    stock: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getBatches(), getMedicines()])
      .then(([batches, meds]) => {
        setBatches(batches);
        setMedicines(meds);
      })
      .catch(() => setError('Failed to fetch batches or medicines'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOpen = () => {
    setAddForm({ medicineId: '', batchNumber: '', expiryDate: '', stock: '' });
    setAddError(null);
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
    setAddError(null);
  };
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddSubmit = async () => {
    setAddLoading(true);
    setAddError(null);
    try {
      const newBatch = await addBatch({
        medicineId: Number(addForm.medicineId),
        batchNumber: addForm.batchNumber,
        expiryDate: addForm.expiryDate,
        stock: Number(addForm.stock),
      });
      setBatches((prev) => [...prev, newBatch]);
      setOpenAdd(false);
    } catch (err) {
      setAddError('Failed to add batch');
    } finally {
      setAddLoading(false);
    }
  };
  const handleEditOpen = (batch: PharmacyBatch) => {
    setEditForm({
      id: batch.id,
      medicineId: String(batch.medicineId),
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      stock: String(batch.stock),
    });
    setEditError(null);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setEditError(null);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await updateBatch(editForm.id, {
        medicineId: Number(editForm.medicineId),
        batchNumber: editForm.batchNumber,
        expiryDate: editForm.expiryDate,
        stock: Number(editForm.stock),
      });
      setBatches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setOpenEdit(false);
    } catch (err) {
      setEditError('Failed to update batch');
    } finally {
      setEditLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteBatch(id);
      setBatches((prev) => prev.filter((b) => b.id !== id));
      setDeleteId(null);
    } catch (err) {
      setDeleteError('Failed to delete batch');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Batches</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddOpen}>Add Batch</Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell>Batch Number</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{medicines.find(m => m.id === batch.medicineId)?.name || batch.medicineId}</TableCell>
                  <TableCell>{batch.batchNumber}</TableCell>
                  <TableCell>{batch.expiryDate}</TableCell>
                  <TableCell>{batch.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(batch)} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(batch.id)} size="small" disabled={deleteLoading && deleteId === batch.id}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Add Batch Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Batch</DialogTitle>
        <DialogContent>
          <TextField select margin="dense" label="Medicine" name="medicineId" value={addForm.medicineId} onChange={handleAddChange} fullWidth required>
            {medicines.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </TextField>
          <TextField margin="dense" label="Batch Number" name="batchNumber" value={addForm.batchNumber} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Expiry Date" name="expiryDate" value={addForm.expiryDate} onChange={handleAddChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" label="Stock" name="stock" value={addForm.stock} onChange={handleAddChange} type="number" fullWidth required />
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Batch Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Batch</DialogTitle>
        <DialogContent>
          <TextField select margin="dense" label="Medicine" name="medicineId" value={editForm.medicineId} onChange={handleEditChange} fullWidth required>
            {medicines.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </TextField>
          <TextField margin="dense" label="Batch Number" name="batchNumber" value={editForm.batchNumber} onChange={handleEditChange} fullWidth required />
          <TextField margin="dense" label="Expiry Date" name="expiryDate" value={editForm.expiryDate} onChange={handleEditChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" label="Stock" name="stock" value={editForm.stock} onChange={handleEditChange} type="number" fullWidth required />
          {editError && <Typography color="error">{editError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={editLoading}>
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete error message */}
      {deleteError && <Typography color="error" sx={{ mt: 1 }}>{deleteError}</Typography>}
    </Paper>
  );
};

export default PharmacyBatches;
