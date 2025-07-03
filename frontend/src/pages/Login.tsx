import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Activity, Heart, Shield, Users } from 'lucide-react';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      login(response.token, response.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 2,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Activity size={32} />
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    MediCare
                  </Typography>
                </Box>
                
                <Typography variant="h3" fontWeight={700} mb={3} lineHeight={1.2}>
                  Advanced Hospital Management System
                </Typography>
                
                <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
                  Streamline your healthcare operations with our comprehensive digital solution
                </Typography>
                
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Heart size={24} />
                    <Typography variant="body1">
                      Complete patient care management
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Users size={24} />
                    <Typography variant="body1">
                      Multi-role access control
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Shield size={24} />
                    <Typography variant="body1">
                      Secure and compliant platform
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: { xs: '0 0 16px 16px', md: '0 16px 16px 0' },
                backgroundColor: 'white',
              }}
            >
              <Box mb={4}>
                <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to access your hospital dashboard
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    height: 56,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 3,
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    New to MediCare?
                  </Typography>
                </Divider>

                <Box textAlign="center">
                  <MuiLink 
                    component={Link} 
                    to="/register" 
                    variant="body1"
                    sx={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create your account →
                  </MuiLink>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};