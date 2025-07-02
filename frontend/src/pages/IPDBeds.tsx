import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ipdService, IPDBed } from '../services/ipdService';

export const IPDBeds: React.FC = () => {
  const [beds, setBeds] = useState<IPDBed[]>([]);
  const [loading, setLoading] = useState(false);
  const [editBed, setEditBed] = useState<IPDBed | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ wardId: '', bedNumber: '', status: 'VACANT' });

  const fetchBeds = async () => {
    setLoading(true);
    setBeds(await ipdService.getBedsByWard(''));
    setLoading(false);
  };

  useEffect(() => { fetchBeds(); }, []);

  const handleEdit = (bed: IPDBed) => {
    setEditBed(bed);
    setForm({ wardId: String(bed.wardId), bedNumber: bed.bedNumber, status: bed.status });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await ipdService.deleteBed(id);
    fetchBeds();
  };

  const handleStatusChange = async (bed: IPDBed, status: string) => {
    await ipdService.updateBedStatus(bed.id, status);
    fetchBeds();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditBed(null);
    setForm({ wardId: '', bedNumber: '', status: 'VACANT' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name!]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editBed) {
      await ipdService.updateBed(editBed.id, { ...form, wardId: Number(form.wardId) });
    } else {
      await ipdService.addBed({ ...form, wardId: Number(form.wardId) });
    }
    handleDialogClose();
    fetchBeds();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>Add Bed</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ward ID</TableCell>
              <TableCell>Bed Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beds.map(bed => (
              <TableRow key={bed.id}>
                <TableCell>{bed.id}</TableCell>
                <TableCell>{bed.wardId}</TableCell>
                <TableCell>{bed.bedNumber}</TableCell>
                <TableCell>
                  <Select
                    value={bed.status}
                    onChange={e => handleStatusChange(bed, e.target.value as string)}
                    size="small"
                  >
                    <MenuItem value="VACANT">VACANT</MenuItem>
                    <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
                    <MenuItem value="CLEANING">CLEANING</MenuItem>
                    <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(bed)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(bed.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editBed ? 'Edit Bed' : 'Add Bed'}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField label="Ward ID" name="wardId" value={form.wardId} onChange={handleFormChange} fullWidth required margin="dense" />
            <TextField label="Bed Number" name="bedNumber" value={form.bedNumber} onChange={handleFormChange} fullWidth required margin="dense" />
            <Select label="Status" name="status" value={form.status} onChange={handleFormChange} fullWidth required margin="dense">
              <MenuItem value="VACANT">VACANT</MenuItem>
              <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
              <MenuItem value="CLEANING">CLEANING</MenuItem>
              <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editBed ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};
