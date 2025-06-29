import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};