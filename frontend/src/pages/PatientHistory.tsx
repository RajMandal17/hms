import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Box, CircularProgress, Button
} from '@mui/material';
import { consultationService } from '../services/consultationService';
import { Consultation } from '../types';

const PatientHistory: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    console.log('Fetching consultations for patientId:', patientId); // DEBUG
    consultationService
      .getConsultationsByPatientId(patientId)
      .then((data) => {
        console.log('Consultation history response:', data); // DEBUG
        setConsultations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError('Failed to load consultation history: ' + (err?.message || ''));
        console.error('Consultation history error:', err); // DEBUG
        if (err && err.response) {
          console.error('Error response data:', err.response.data); // DEBUG
        }
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="outlined" onClick={() => navigate('/patient-history')} sx={{ mb: 2 }}>
        Back to All Patients
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, ml: 2 }}
        onClick={async () => {
          if (!patientId) return;
          try {
            const blob = await consultationService.downloadPatientHistoryPdf(patientId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient_history_${patientId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          } catch (e) {
            alert('Failed to download PDF');
          }
        }}
      >
        Download PDF
      </Button>
      <Typography variant="h5" gutterBottom>
        Consultation History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (consultations || []).length === 0 ? (
        <Typography>No consultations found for this patient.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Symptoms</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Medicines</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Follow Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(consultations || []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.consultationTime ? new Date(c.consultationTime).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{c.patientName || '-'}</TableCell>
                  <TableCell>{c.doctorName || '-'}</TableCell>
                  <TableCell>{c.symptoms || '-'}</TableCell>
                  <TableCell>{c.diagnosis || '-'}</TableCell>
                  <TableCell>{Array.isArray(c.medicines) && c.medicines.length > 0 ? c.medicines.map(m => m.name).join(', ') : '-'}</TableCell>
                  <TableCell>{c.prescription || '-'}</TableCell>
                  <TableCell>{c.notes || '-'}</TableCell>
                  <TableCell>{c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default PatientHistory;
