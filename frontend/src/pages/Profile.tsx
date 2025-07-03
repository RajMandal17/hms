import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <Typography variant="body1"><b>Username:</b> {user.username}</Typography>
        <Typography variant="body1"><b>Email:</b> {user.email}</Typography>
        <Typography variant="body1"><b>Roles:</b> {Array.isArray(user.roles) ? user.roles.join(', ') : user.role}</Typography>
      </Paper>
      <ChangePasswordForm />
    </Box>
  );
};

export default Profile;
