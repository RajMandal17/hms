import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Link } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export const PublicLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            City Hospital
          </Typography>
          <nav>
            <Link component={RouterLink} to="/" variant="button" color="text.primary" sx={{ my: 1, mx: 1.5, textDecoration: 'none' }}>
              Home
            </Link>
            <Link href="#services" variant="button" color="text.primary" sx={{ my: 1, mx: 1.5, textDecoration: 'none' }}>
              Services
            </Link>
            <Link href="#doctors" variant="button" color="text.primary" sx={{ my: 1, mx: 1.5, textDecoration: 'none' }}>
              Doctors
            </Link>
          </nav>
          <Button component={RouterLink} to="/book-appointment" variant="contained" color="primary" sx={{ ml: 2 }}>
            Book Appointment
          </Button>
          <Button component={RouterLink} to="/login" variant="outlined" color="primary" sx={{ ml: 1 }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            City Hospital - Caring for Life
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://your-website.com/">
              City Hospital
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
