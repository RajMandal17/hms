import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography, MenuItem, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const IntakeForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        healthCardNumber: '',
        phone: '',
        reason: 'General Check-up',
        notes: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            setSnackbar({ open: true, message: 'Please fill in required fields', severity: 'error' });
            return;
        }
        try {
            await axios.post('/api/public/intake', formData);
            setSnackbar({ open: true, message: '✅ Intake form submitted securely!', severity: 'success' });
            setFormData({ firstName: '', lastName: '', dob: '', healthCardNumber: '', phone: '', reason: 'General Check-up', notes: '' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to submit form', severity: 'error' });
        }
    };

    return (
        <Box component="form" sx={{ bgcolor: '#f7fafc', p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ color: '#0f4a3e', mb: 2 }}>Pre-Visit Patient Information</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField fullWidth label="First Name *" size="small" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Last Name *" size="small" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Date of Birth *" type="date" size="small" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Health Card Number" size="small" value={formData.healthCardNumber} onChange={e => setFormData({ ...formData, healthCardNumber: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Phone Number *" size="small" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                    <TextField select fullWidth label="Reason for Visit" size="small" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}>
                        {['General Check-up', 'Follow-up Appointment', 'New Health Concern', 'Prescription Renewal', 'Referral Request'].map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Additional Notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#1a6b5a', '&:hover': { bgcolor: '#0f4a3e' } }}>
                        Submit Intake Form
                    </Button>
                    <Typography variant="caption" display="block" align="center" sx={{ mt: 1, color: '#718096' }}>
                        🔒 Submitted securely. All data stored in PHIPA-compliant system.
                    </Typography>
                </Grid>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default IntakeForm;
