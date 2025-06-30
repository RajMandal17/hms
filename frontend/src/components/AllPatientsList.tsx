import React, { useEffect, useState } from 'react';
import { patientService } from '../services/patientService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';

export const AllPatientsList: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    patientService.getPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>All Patients</Typography>
      {loading ? <CircularProgress /> : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.lastName}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
