import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import BookingWidget from '../../components/public/BookingWidget';

export const BookingPage = () => {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box mb={4} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom color="primary.main" fontWeight="bold">
                        Book Your Appointment
                    </Typography>
                    <Typography color="text.secondary">
                        Follow the steps below to schedule a visit with our specialists.
                    </Typography>
                </Box>
                <BookingWidget />
            </Paper>
        </Container>
    );
};
