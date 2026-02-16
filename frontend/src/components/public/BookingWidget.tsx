import React, { useState, useEffect } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';

const API_BASE_URL = 'http://localhost:8080/api/public';

const steps = ['Select Doctor', 'Select Date & Time', 'Personal Details', 'Confirmation'];

interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

export const BookingWidget = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [patientDetails, setPatientDetails] = useState({
        name: '',
        email: '',
        phone: '',
        reason: ''
    });

    useEffect(() => {
        // Fetch doctors
        axios.get(`${API_BASE_URL}/doctors`)
            .then(res => setDoctors(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchSlots();
        }
    }, [selectedDoctor, selectedDate]);

    const fetchSlots = () => {
        if (!selectedDoctor || !selectedDate) return;
        setLoading(true);
        const dateStr = selectedDate.format('YYYY-MM-DD');
        axios.get(`${API_BASE_URL}/slots`, {
            params: { doctorId: selectedDoctor.id, date: dateStr }
        })
            .then(res => {
                setAvailableSlots(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleNext = () => {
        if (activeStep === 2) {
            bookAppointment();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const bookAppointment = () => {
        setLoading(true);
        const payload = {
            doctorId: selectedDoctor?.id,
            appointmentDate: selectedDate?.format('YYYY-MM-DD'),
            appointmentTime: selectedSlot,
            patientName: patientDetails.name,
            patientEmail: patientDetails.email,
            patientPhone: patientDetails.phone,
            reason: patientDetails.reason
        };

        axios.post(`${API_BASE_URL}/appointments/book`, payload)
            .then(res => {
                setSuccess(true);
                setLoading(false);
                setActiveStep((prev) => prev + 1);
            })
            .catch(err => {
                setError('Failed to book appointment. Please try again.');
                setLoading(false);
            });
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        {doctors.map((doctor) => (
                            <Grid item xs={12} sm={6} key={doctor.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderColor: selectedDoctor?.id === doctor.id ? 'primary.main' : 'divider',
                                        bgcolor: selectedDoctor?.id === doctor.id ? 'primary.light' : 'background.paper'
                                    }}
                                >
                                    <CardActionArea onClick={() => setSelectedDoctor(doctor)}>
                                        <CardContent>
                                            <Typography variant="h6">{doctor.name}</Typography>
                                            <Typography color="textSecondary">{doctor.specialization}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Select Date</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    disablePast
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Select Time Slot</Typography>
                            {loading ? <CircularProgress /> : (
                                <Grid container spacing={1}>
                                    {availableSlots.length > 0 ? availableSlots.map((slot) => (
                                        <Grid item key={slot}>
                                            <Button
                                                variant={selectedSlot === slot ? "contained" : "outlined"}
                                                onClick={() => setSelectedSlot(slot)}
                                                size="small"
                                            >
                                                {slot}
                                            </Button>
                                        </Grid>
                                    )) : <Typography>No slots available</Typography>}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Full Name"
                                    value={patientDetails.name}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Phone Number"
                                    value={patientDetails.phone}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={patientDetails.email}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Reason for Visit"
                                    multiline
                                    rows={3}
                                    value={patientDetails.reason}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 3:
                return (
                    <Box textAlign="center" py={4}>
                        {success ? (
                            <>
                                <Typography variant="h4" color="success.main" gutterBottom>
                                    Appointment Confirmed!
                                </Typography>
                                <Typography paragraph>
                                    Thank you, {patientDetails.name}. Your appointment with Dr. {selectedDoctor?.name} is scheduled for {selectedDate?.format('MMMM D, YYYY')} at {selectedSlot}.
                                </Typography>
                                <Typography color="textSecondary">
                                    A confirmation email has been sent to {patientDetails.email}.
                                </Typography>
                                <Button variant="contained" sx={{ mt: 4 }} href="/">Back to Home</Button>
                            </>
                        ) : (
                            <Alert severity="error">{error || "Something went wrong"}</Alert>
                        )}
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 4, mb: 4, minHeight: '300px' }}>
                {renderStepContent(activeStep)}
            </Box>
            {activeStep < 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext} disabled={
                        (activeStep === 0 && !selectedDoctor) ||
                        (activeStep === 1 && (!selectedDate || !selectedSlot)) ||
                        (activeStep === 2 && (!patientDetails.name || !patientDetails.phone || !patientDetails.email))
                    }>
                        {activeStep === steps.length - 2 ? 'Confirm Booking' : 'Next'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};
