import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AddVitalsModal } from '../components/AddVitalsModal';
import { ipdService } from '../services/ipdService';
import { vitalsService } from '../services/vitalsService';

interface Admission {
  id: string | number;
  patient?: { name?: string };
}

interface Vitals {
  timestamp?: string;
  bp?: string;
  pulse?: number;
  temperature?: number;
}

const IPDVitals: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedAdmission, setSelectedAdmission] = useState<string>('');
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ipdService.getAdmissions().then(setAdmissions);
  }, []);

  useEffect(() => {
    if (selectedAdmission) {
      setLoading(true);
      vitalsService.getVitals(selectedAdmission)
        .then((res: any) => setVitals(res.data as Vitals[]))
        .finally(() => setLoading(false));
    } else {
      setVitals([]);
    }
  }, [selectedAdmission, openModal]);

  return (
    <Paper sx={{ p: 3, maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom component="div">
        IPD Vitals
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel id="admission-label">Select Admission</InputLabel>
          <Select
            labelId="admission-label"
            value={selectedAdmission}
            label="Select Admission"
            onChange={e => setSelectedAdmission(e.target.value)}
          >
            {admissions.map(adm => (
              <MenuItem key={adm.id} value={adm.id}>
                {adm.patient?.name ? `${adm.patient.name} (ID: ${adm.id})` : `Admission #${adm.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setOpenModal(true)} disabled={!selectedAdmission}>
          Add Vitals
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date/Time</TableCell>
              <TableCell>BP</TableCell>
              <TableCell>Pulse</TableCell>
              <TableCell>Temperature (°C)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vitals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No vitals recorded.</TableCell>
              </TableRow>
            ) : (
              vitals.map((v, idx) => (
                <TableRow key={idx}>
                  <TableCell>{v.timestamp ? new Date(v.timestamp).toLocaleString() : ''}</TableCell>
                  <TableCell>{v.bp}</TableCell>
                  <TableCell>{v.pulse}</TableCell>
                  <TableCell>{v.temperature}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      <AddVitalsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => setOpenModal(false)}
      />
    </Paper>
  );
};

export default IPDVitals;
