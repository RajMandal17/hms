

import React, { useEffect, useState } from 'react';
import { getMedicines, addMedicine, updateMedicine, deleteMedicine, Medicine } from '../services/pharmacyService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// ...existing imports...

// Only one PharmacyMedicines component should exist!
const PharmacyMedicines: React.FC = () => {
  // Edit state
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    category: '',
    manufacturer: '',
    stock: '',
    expiryDate: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Medicines state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    manufacturer: '',
    stock: '',
    expiryDate: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ...existing handlers (handleEditOpen, handleEditClose, etc.)...

  useEffect(() => {
    setLoading(true);
    getMedicines()
      .then(setMedicines)
      .catch(() => setError('Failed to fetch medicines'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOpen = () => {
    setAddForm({ name: '', category: '', manufacturer: '', stock: '', expiryDate: '' });
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
      const newMed = await addMedicine({
        name: addForm.name,
        category: addForm.category,
        manufacturer: addForm.manufacturer,
        stock: Number(addForm.stock),
        expiryDate: addForm.expiryDate,
      });
      setMedicines((prev) => [...prev, newMed]);
      setOpenAdd(false);
    } catch (err) {
      setAddError('Failed to add medicine');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Medicines</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddOpen}>Add Medicine</Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Expiry Date</TableCell>
                {/* Add more columns as needed */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.category}</TableCell>
                  <TableCell>{med.manufacturer}</TableCell>
                  <TableCell>{med.stock}</TableCell>
                  <TableCell>{med.expiryDate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(med)} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(med.id)} size="small" disabled={deleteLoading && deleteId === med.id}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
      {/* Edit Medicine Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Medicine</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth required />
          <TextField margin="dense" label="Category" name="category" value={editForm.category} onChange={handleEditChange} fullWidth required />
          <TextField margin="dense" label="Manufacturer" name="manufacturer" value={editForm.manufacturer} onChange={handleEditChange} fullWidth required />
          <TextField margin="dense" label="Stock" name="stock" value={editForm.stock} onChange={handleEditChange} type="number" fullWidth required />
          <TextField margin="dense" label="Expiry Date" name="expiryDate" value={editForm.expiryDate} onChange={handleEditChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
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
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" value={addForm.name} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Category" name="category" value={addForm.category} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Manufacturer" name="manufacturer" value={addForm.manufacturer} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Stock" name="stock" value={addForm.stock} onChange={handleAddChange} type="number" fullWidth required />
          <TextField margin="dense" label="Expiry Date" name="expiryDate" value={addForm.expiryDate} onChange={handleAddChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PharmacyMedicines;
