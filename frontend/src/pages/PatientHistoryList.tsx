import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Box, TextField, TablePagination, CircularProgress
} from '@mui/material';
import { patientService } from '../services/patientService';

const PatientHistoryList: React.FC = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    patientService.getPatients()
      .then(data => setPatients(data))
      .catch(() => setError('Failed to load patients'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>All Patients</Typography>
      <TextField
        label="Search Patient"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? <CircularProgress /> : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.firstName ? `${p.firstName} ${p.lastName || ''}` : p.name}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.phone || p.contact}</TableCell>
                  <TableCell>
                    <button onClick={() => navigate(`/patient-history/${p.id}`)}>View History</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default PatientHistoryList;
