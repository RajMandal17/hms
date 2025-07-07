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
    price: '',
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
    price: '',
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
      price: medicine.price !== undefined && medicine.price !== null ? String(medicine.price) : '',
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
        price: Number(editForm.price),
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
    setAddForm({ name: '', category: '', manufacturer: '', description: '', price: '', stock: '', expiryDate: '' });
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
        price: Number(addForm.price),
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
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>{medicine.manufacturer}</TableCell>
                  <TableCell>{medicine.description}</TableCell>
                  <TableCell>{medicine.price ?? '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(medicine)}><EditIcon /></IconButton>
                    <IconButton onClick={() => setDeleteId(medicine.id!)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Edit Medicine Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Medicine</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} fullWidth margin="dense" />
          <TextField label="Category" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} fullWidth margin="dense" />
          <TextField label="Manufacturer" value={editForm.manufacturer} onChange={e => setEditForm({ ...editForm, manufacturer: e.target.value })} fullWidth margin="dense" />
          <TextField label="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} fullWidth margin="dense" />
          <TextField label="Price" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} type="number" fullWidth margin="dense" />
          <TextField label="Stock" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} type="number" fullWidth margin="dense" />
          <TextField label="Expiry Date" value={editForm.expiryDate} onChange={e => setEditForm({ ...editForm, expiryDate: e.target.value })} type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
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
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} fullWidth margin="dense" />
          <TextField label="Category" value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} fullWidth margin="dense" />
          <TextField label="Manufacturer" value={addForm.manufacturer} onChange={e => setAddForm({ ...addForm, manufacturer: e.target.value })} fullWidth margin="dense" />
          <TextField label="Description" value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} fullWidth margin="dense" />
          <TextField label="Price" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} type="number" fullWidth margin="dense" />
          <TextField label="Stock" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} type="number" fullWidth margin="dense" />
          <TextField label="Expiry Date" value={addForm.expiryDate} onChange={e => setAddForm({ ...addForm, expiryDate: e.target.value })} type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
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
