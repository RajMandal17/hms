import React, { useEffect, useState } from 'react';
import { getMedicines, addMedicine, updateMedicine, deleteMedicine, Medicine } from '../services/pharmacyService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// Only one PharmacyMedicines component should exist!
const PharmacyMedicines: React.FC = () => {
  // Edit state
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    category: '',
    manufacturer: '',
    description: '',
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
    description: '',
    stock: '',
    expiryDate: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleEditOpen = (medicine: Medicine) => {
    setEditForm({
      id: medicine.id,
      name: medicine.name || '',
      category: medicine.category || '',
      manufacturer: medicine.manufacturer || '',
      description: medicine.description || '',
      stock: medicine.stock !== undefined && medicine.stock !== null ? String(medicine.stock) : '',
      expiryDate: medicine.expiryDate || '',
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
      const updatedMed = await updateMedicine(editForm.id, {
        name: editForm.name,
        category: editForm.category,
        manufacturer: editForm.manufacturer,
        description: editForm.description,
        stock: Number(editForm.stock),
        expiryDate: editForm.expiryDate,
      });
      setMedicines((prev) => prev.map((med) => (med.id === updatedMed.id ? updatedMed : med)));
      setOpenEdit(false);
    } catch (err) {
      setEditError('Failed to update medicine');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((med) => med.id !== id));
    } catch (err) {
      setDeleteError('Failed to delete medicine');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getMedicines()
      .then(setMedicines)
      .catch(() => setError('Failed to fetch medicines'))
      .finally(() => setLoading(false));

    // Listen for medicine-added event to refresh list
    const handleMedicineAdded = () => {
      setLoading(true);
      getMedicines()
        .then(setMedicines)
        .catch(() => setError('Failed to fetch medicines'))
        .finally(() => setLoading(false));
    };
    window.addEventListener('medicine-added', handleMedicineAdded);
    return () => window.removeEventListener('medicine-added', handleMedicineAdded);
  }, []);

  const handleAddOpen = () => {
    setAddForm({ name: '', category: '', manufacturer: '', description: '', stock: '', expiryDate: '' });
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
        description: addForm.description,
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

  const getTotalStock = (batches: any[] = []) =>
    batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);

  const getEarliestExpiry = (batches: any[] = []) => {
    if (!batches.length) return '';
    const validDates = batches
      .map((batch) => batch.expiryDate)
      .filter(Boolean)
      .sort();
    return validDates.length ? validDates[0] : '';
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
                  <TableCell>{getTotalStock(med.batches)}</TableCell>
                  <TableCell>{getEarliestExpiry(med.batches)}</TableCell>
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
          <TextField margin="dense" label="Description" name="description" value={editForm.description} onChange={handleEditChange} fullWidth />
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
          <TextField margin="dense" label="Description" name="description" value={addForm.description} onChange={handleAddChange} fullWidth />
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
