import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ChangePasswordForm: React.FC = () => {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) return;
    if (newPassword !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    try {
      await apiService.post('/users/change-password', {
        username: user.username,
        oldPassword,
        newPassword,
      });
      setSuccess('Password changed successfully. Please log in again.');
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        label="Current Password"
        type="password"
        fullWidth
        margin="normal"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        required
      />
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm New Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Change Password
      </Button>
    </Box>
  );
};
