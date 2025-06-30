import React, { useEffect, useState } from 'react';
import { ipdService } from '../services/ipdService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';

export const AdmittedPatientsList: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ipdService.getAdmissions()
      .then(setAdmissions)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>Admitted Patients</Typography>
      {loading ? <CircularProgress /> : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Doctor ID</TableCell>
                <TableCell>Ward</TableCell>
                <TableCell>Bed</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Admission Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admissions.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.patientId}</TableCell>
                  <TableCell>{a.doctorId}</TableCell>
                  <TableCell>{a.wardId}</TableCell>
                  <TableCell>{a.bedId}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>{a.admissionDate ? new Date(a.admissionDate).toLocaleString() : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
