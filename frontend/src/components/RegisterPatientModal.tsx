import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Alert
} from '@mui/material';
import { patientService } from '../services/patientService';

interface RegisterPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({ open, onClose, onSuccess }) => {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    photo: null as File | null,
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files.length > 0) {
      setRegisterData({ ...registerData, photo: files[0] });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    try {
      const formData = new FormData();
      formData.append('firstName', registerData.firstName);
      formData.append('lastName', registerData.lastName);
      formData.append('age', registerData.age);
      formData.append('gender', registerData.gender);
      formData.append('phone', registerData.phone);
      formData.append('address', registerData.address);
      if (registerData.photo) {
        formData.append('photo', registerData.photo);
      }
      await patientService.createPatient(formData);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>Register Patient</Typography>
        <form onSubmit={handleRegisterSubmit} encType="multipart/form-data">
          <TextField
            label="First Name"
            name="firstName"
            value={registerData.firstName}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={registerData.lastName}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={registerData.age}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Gender"
            name="gender"
            value={registerData.gender}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={registerData.phone}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            name="address"
            value={registerData.address}
            onChange={handleRegisterChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
          >
            Upload Photo
            <input
              type="file"
              name="photo"
              accept="image/*"
              hidden
              onChange={handleRegisterChange}
            />
          </Button>
          {registerData.photo && (
            <Typography variant="body2" color="text.secondary">
              Selected: {registerData.photo.name}
            </Typography>
          )}
          {registerError && <Alert severity="error">{registerError}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={registerLoading}
            sx={{ mt: 2 }}
          >
            {registerLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
