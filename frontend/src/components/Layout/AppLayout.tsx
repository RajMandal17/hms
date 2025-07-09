import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, CircularProgress, Badge } from '@mui/material';
import { getPendingBills } from '../../services/billingService';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  CalendarToday,
  Assignment,
  Logout,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  LocalHospital,
  LocalPharmacy,
  ReceiptLong,
  History,
  Notifications,
  Settings,
  Help,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity } from 'lucide-react';
import { RegisterPatientModal } from '../RegisterPatientModal';
import { BookAppointmentModal } from '../BookAppointmentModal';
import { AdmitPatientModal } from '../AdmitPatientModal';
import { AddWardModal } from '../AddWardModal';
import { AdmittedPatientsList } from '../AdmittedPatientsList';
import { AddVitalsModal } from '../AddVitalsModal';
import { AddDoctorRoundModal } from '../AddDoctorRoundModal';
import { AddMedicineModal } from '../AddMedicineModal';

const drawerWidth = 280;

interface AppLayoutProps {
  children: React.ReactNode;
  onPatientRegistered?: () => void;
  onAppointmentBooked?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onPatientRegistered, onAppointmentBooked }) => {
  // Pharmacy alert state
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);
  const [pharmacyError, setPharmacyError] = useState('');
  
  // Billing alert state
  const [pendingBills, setPendingBills] = useState<any[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState('');

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openOpd, setOpenOpd] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openBookAppointment, setOpenBookAppointment] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openIpd, setOpenIpd] = useState(false);
  const [openAdmitPatient, setOpenAdmitPatient] = useState(false);
  const [openAddWard, setOpenAddWard] = useState(false);
  const [openAddVitals, setOpenAddVitals] = useState(false);
  const [openAddDoctorRound, setOpenAddDoctorRound] = useState(false);
  const [openPharmacy, setOpenPharmacy] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);
  const [openAddMedicine, setOpenAddMedicine] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [admitRefreshKey, setAdmitRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasAnyRole } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setPharmacyLoading(true);
        setBillingLoading(true);
        
        const [lowStockRes, expiringRes, pendingBillsRes] = await Promise.all([
          axios.get('/api/pharmacy/batches/low-stock?threshold=10'),
          axios.get('/api/pharmacy/batches/expiring?daysAhead=30'),
          getPendingBills(),
        ]);
        
        setLowStock(lowStockRes.data);
        setExpiring(expiringRes.data);
        setPendingBills(pendingBillsRes.data);
      } catch (err: any) {
        setPharmacyError('Failed to load alerts');
        setBillingError('Failed to load billing alerts');
      } finally {
        setPharmacyLoading(false);
        setBillingLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const getTotalAlerts = () => {
    return lowStock.length + expiring.length + pendingBills.length;
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'ACCOUNTANT'],
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={24} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary" component="div">
              MediCare
            </Typography>
            <Box component="span">
              <Typography variant="caption" color="text.secondary" component="span">
                Hospital Management
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <Box sx={{ flex: 1, px: 2, py: 1 }}>
        <List>
          {/* Dashboard */}
          <ListItemButton
            onClick={() => navigate('/dashboard')}
            selected={location.pathname === '/dashboard'}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* OPD Section */}
          <ListItemButton onClick={() => setOpenOpd(!openOpd)} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon>
              <LocalHospital />
            </ListItemIcon>
            <ListItemText primary="OPD" />
            {openOpd ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openOpd} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => setOpenRegister(true)}
              >
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Register Patient" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => setOpenBookAppointment(true)}
              >
                <ListItemIcon><CalendarToday /></ListItemIcon>
                <ListItemText primary="Book Appointment" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/consultations')}
                selected={location.pathname === '/consultations'}
              >
                <ListItemIcon><Assignment /></ListItemIcon>
                <ListItemText primary="Consultations" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/patient-history')}
                selected={location.pathname.startsWith('/patient-history')}
              >
                <ListItemIcon><History /></ListItemIcon>
                <ListItemText primary="Patient History" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* IPD Section */}
          <ListItemButton onClick={() => setOpenIpd(!openIpd)} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="IPD" />
            {openIpd ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openIpd} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => setOpenAdmitPatient(true)}
              >
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Admit Patient" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => setOpenAddWard(true)}
              >
                <ListItemIcon><Assignment /></ListItemIcon>
                <ListItemText primary="Add Ward" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/ipd/beds')}
                selected={location.pathname.startsWith('/ipd/beds')}
              >
                <ListItemIcon><Assignment /></ListItemIcon>
                <ListItemText primary="IPD Beds" />
              </ListItemButton>
           
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/ipd/billing')}
                selected={location.pathname === '/ipd/billing'}
              >
                <ListItemIcon><ReceiptLong /></ListItemIcon>
                <ListItemText primary="IPD Billing" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Pharmacy Section */}
          <ListItemButton onClick={() => setOpenPharmacy(!openPharmacy)} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon>
              <Badge badgeContent={lowStock.length + expiring.length} color="error">
                <LocalPharmacy />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Pharmacy" />
            {openPharmacy ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openPharmacy} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/pharmacy/medicines')}
                selected={location.pathname.startsWith('/pharmacy/medicines')}
              >
                <ListItemText primary="Medicines" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/pharmacy/batches')}
                selected={location.pathname.startsWith('/pharmacy/batches')}
              >
                <ListItemText primary="Batches" />
                {lowStock.length > 0 && (
                  <Chip size="small" label={lowStock.length} color="error" />
                )}
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/pharmacy/sales')}
                selected={location.pathname.startsWith('/pharmacy/sales')}
              >
                <ListItemText primary="Sales" />
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => setOpenAddMedicine(true)}
              >
                <ListItemText primary="Add Medicine" />
              </ListItemButton>
              {/* Add more pharmacy submenu items here if needed */}
            </List>
          </Collapse>

          {/* Billing Section */}
          <ListItemButton onClick={() => setOpenBilling(!openBilling)} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon>
              <Badge badgeContent={pendingBills.length} color="warning">
                <ReceiptLong />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Billing" />
            {openBilling ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openBilling} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/billing')}
                selected={location.pathname === '/billing'}
              >
                <ListItemText primary="All Bills" />
                {pendingBills.length > 0 && (
                  <Chip size="small" label={pendingBills.length} color="warning" />
                )}
              </ListItemButton>
              <ListItemButton
                sx={{ borderRadius: 2, mb: 0.5 }}
                onClick={() => navigate('/billing/insurance-claims')}
                selected={location.pathname.startsWith('/billing/insurance-claims')}
              >
                <ListItemText primary="Insurance Claims" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Billing Refunds */}
          {(user && (user.role === 'ADMIN' || user.role === 'PHARMACIST' || (user.roles && (user.roles.includes('ADMIN') || user.roles.includes('PHARMACIST'))))) && (
            <ListItemButton
              sx={{ borderRadius: 2, mb: 0.5 }}
              onClick={() => navigate('/billing/refunds')}
              selected={location.pathname === '/billing/refunds'}
            >
              <ListItemIcon><ReceiptLong /></ListItemIcon>
              <ListItemText primary="Refunds" />
            </ListItemButton>
          )}

          {/* Billing Refund Audit Logs (ADMIN only) */}
          {user && (user.role === 'ADMIN' || (user.roles && user.roles.includes('ADMIN'))) && (
            <ListItemButton
              sx={{ borderRadius: 2, mb: 0.5 }}
              onClick={() => navigate('/billing/refund-audit')}
              selected={location.pathname === '/billing/refund-audit'}
            >
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Refund Audit Logs" />
            </ListItemButton>
          )}

          {/* ADMIN ONLY: Create User */}
          {user && (user.role === 'ADMIN' || (user.roles && user.roles.includes('ADMIN'))) && (
            <ListItemButton
              sx={{ borderRadius: 2, mb: 0.5 }}
              onClick={() => navigate('/register')}
              selected={location.pathname === '/register'}
            >
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="Create User" />
            </ListItemButton>
          )}
        </List>
      </Box>

      {/* Bottom section with user info */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Paper sx={{ p: 2, backgroundColor: '#f8fafc' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#2563eb' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={500} component="div">
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="span">
                {user?.role}
              </Typography>
            </Box>
            {getTotalAlerts() > 0 && (
              <Badge badgeContent={getTotalAlerts()} color="error">
                <Notifications fontSize="small" />
              </Badge>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Modals */}
      <RegisterPatientModal 
        open={openRegister} 
        onClose={() => setOpenRegister(false)} 
        onSuccess={onPatientRegistered} 
      />
      <BookAppointmentModal 
        open={openBookAppointment} 
        onClose={() => setOpenBookAppointment(false)} 
        onSuccess={onAppointmentBooked} 
      />
      <AdmitPatientModal 
        open={openAdmitPatient} 
        onClose={() => setOpenAdmitPatient(false)} 
        onSuccess={() => setAdmitRefreshKey(k => k + 1)} 
      />
      <AddWardModal 
        open={openAddWard} 
        onClose={() => setOpenAddWard(false)} 
        onSuccess={onPatientRegistered} 
      />
      <AddVitalsModal 
        open={openAddVitals} 
        onClose={() => setOpenAddVitals(false)} 
      />
      <AddDoctorRoundModal 
        open={openAddDoctorRound} 
        onClose={() => setOpenAddDoctorRound(false)} 
      />
      <AddMedicineModal 
        open={openAddMedicine} 
        onClose={() => setOpenAddMedicine(false)} 
        onSuccess={() => {
          // Dispatch a custom event to notify the medicines page to refresh
          window.dispatchEvent(new Event('medicine-added'));
        }} 
      />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Hospital Management System
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2}>
            {/* Notifications */}
            <IconButton color="inherit">
              <Badge badgeContent={getTotalAlerts()} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            {/* User Menu */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }} component="span">
                {user?.username}
              </Typography>
              <IconButton onClick={handleMenuClick} color="inherit">
                <Avatar sx={{ width: 32, height: 32, backgroundColor: '#2563eb' }}>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 200 }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Help fontSize="small" />
                </ListItemIcon>
                Help
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
        
        {/* IPD Admitted Patients List */}
        {openIpd && (
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <AdmittedPatientsList refreshKey={admitRefreshKey} />
          </Box>
        )}
      </Box>

      {/* Patient ID Dialog */}
      <Dialog open={openPatientDialog} onClose={() => setOpenPatientDialog(false)}>
        <DialogTitle>Enter Patient ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Patient ID"
            type="text"
            fullWidth
            value={patientIdInput}
            onChange={e => setPatientIdInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (patientIdInput.trim()) {
                navigate(`/patient-history/${patientIdInput.trim()}`);
                setOpenPatientDialog(false);
                setPatientIdInput('');
              }
            }}
            variant="contained"
          >
            View History
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};