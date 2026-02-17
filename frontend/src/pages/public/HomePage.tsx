import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent, CardMedia, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

const API_BASE_URL = '/api/public';

interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

export const HomePage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        // Fetch doctors (mock or real)
        axios.get(`${API_BASE_URL}/doctors`)
            .then(response => setDoctors(response.data))
            .catch(error => console.error('Error fetching doctors', error));
    }, []);

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 8,
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/1600x900/?hospital)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography component="h1" variant="h2" align="center" color="inherit" gutterBottom fontWeight="bold">
                        World-Class Healthcare for You
                    </Typography>
                    <Typography variant="h5" align="center" color="inherit" paragraph>
                        Expert doctors, cutting-edge technology, and compassionate care. Book your appointment online today.
                    </Typography>
                    <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/book-appointment" sx={{ mt: 4, px: 4, py: 1.5, fontSize: '1.2rem' }}>
                        Book an Appointment
                    </Button>
                </Container>
            </Box>

            {/* Services Section */}
            <Container id="services" sx={{ py: 8 }} maxWidth="lg">
                <Typography variant="h3" align="center" gutterBottom color="primary.main" fontWeight="bold">
                    Our Services
                </Typography>
                <Grid container spacing={4} mt={2}>
                    {[
                        { title: 'General Medicine', icon: <MedicalServicesIcon fontSize="large" />, desc: 'Comprehensive care for all your health needs.' },
                        { title: 'Cardiology', icon: <MonitorHeartIcon fontSize="large" />, desc: 'Advanced heart care and surgeries.' },
                        { title: 'Pharmacy', icon: <LocalPharmacyIcon fontSize="large" />, desc: '24/7 Pharmacy with home delivery options.' },
                    ].map((service, index) => (
                        <Grid item key={index} xs={12} sm={4}>
                            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 2 }}>
                                <Box color="secondary.main" mb={2}>
                                    {service.icon}
                                </Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {service.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {service.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Doctors Section */}
            <Box sx={{ bgcolor: 'grey.100', py: 8 }} id="doctors">
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom color="primary.main" fontWeight="bold">
                        Meet Our Doctors
                    </Typography>
                    <Grid container spacing={4} mt={2}>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <Grid item key={doctor.id} xs={12} sm={6} md={4}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`https://source.unsplash.com/400x300/?doctor,${doctor.id}`}
                                            alt={doctor.name}
                                        />
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Dr. {doctor.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {doctor.specialization}
                                            </Typography>
                                            <Button size="small" variant="outlined" sx={{ mt: 2 }} component={RouterLink} to={`/book-appointment`}>
                                                Book Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography align="center" sx={{ width: '100%', mt: 4 }}>No doctors available to display at the moment.</Typography>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};
