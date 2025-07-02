import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, CircularProgress } from '@mui/material';
// Types for pharmacy alerts
interface MedicineBatchAlert {
  id: number;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  medicine: { name: string };
}
// Types for billing alerts
interface PendingBill {
  id: number;
  patientId: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
}

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

const drawerWidth = 240;


interface AppLayoutProps {
  children: React.ReactNode;
  onPatientRegistered?: () => void;
  onAppointmentBooked?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onPatientRegistered, onAppointmentBooked }) => {
  // Pharmacy alert state
  const [lowStock, setLowStock] = useState<MedicineBatchAlert[]>([]);
  const [expiring, setExpiring] = useState<MedicineBatchAlert[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);
  const [pharmacyError, setPharmacyError] = useState('');
  // Billing alert state
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState('');

  useEffect(() => {
    const fetchPharmacyAlerts = async () => {
      try {
        setPharmacyLoading(true);
        setPharmacyError('');
        const [lowStockRes, expiringRes] = await Promise.all([
          axios.get('/api/pharmacy/batches/low-stock?threshold=10'),
          axios.get('/api/pharmacy/batches/expiring?daysAhead=30'),
        ]);
        setLowStock(lowStockRes.data);
        setExpiring(expiringRes.data);
      } catch (err: any) {
        setPharmacyError('Failed to load pharmacy alerts');
      } finally {
        setPharmacyLoading(false);
      }
    };
    const fetchBillingAlerts = async () => {
      try {
        setBillingLoading(true);
        setBillingError('');
        const res = await getPendingBills();
        setPendingBills(res.data);
      } catch (err: any) {
        setBillingError('Failed to load billing alerts');
      } finally {
        setBillingLoading(false);
      }
    };
    fetchPharmacyAlerts();
    fetchBillingAlerts();
  }, []);

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
  const [patientIdInput, setPatientIdInput] = useState('');
  const [admitRefreshKey, setAdmitRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasAnyRole } = useAuth();

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

  // Sidebar with dropdowns
  const drawer = (
    <div>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <Activity size={24} color="#1976d2" />
          <Typography variant="h6" noWrap component="div" color="primary">
            HMS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {/* OPD Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenOpd(!openOpd)}>
            <ListItemIcon>
              <LocalHospital />
            </ListItemIcon>
            <ListItemText primary="OPD" />
            {openOpd ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openOpd} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenRegister(true)}>
              <ListItemIcon><People /></ListItemIcon>
              <ListItemText primary="Register Patient" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenBookAppointment(true)} selected={location.pathname === '/appointments'}>
              <ListItemIcon><CalendarToday /></ListItemIcon>
              <ListItemText primary="Book Appointment" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/consultations')} selected={location.pathname === '/consultations'}>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="Consultation" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/patient-history')} selected={location.pathname.startsWith('/patient-history')}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Patient History" />
            </ListItemButton>
          </List>
        </Collapse>
        {/* IPD Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenIpd(!openIpd)}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="IPD" />
            {openIpd ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openIpd} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenAdmitPatient(true)}>
              <ListItemIcon><People /></ListItemIcon>
              <ListItemText primary="Admit Patient" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenAddWard(true)}>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="Add Ward" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenAddVitals(true)}>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="Add Vitals (Nurse)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => setOpenAddDoctorRound(true)}>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="Add Doctor Round (Doctor)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ipd/beds')} selected={location.pathname === '/ipd/beds'}>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="IPD Beds" />
            </ListItemButton>
          </List>
        </Collapse>
        {/* Pharmacy Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenPharmacy((prev) => !prev)}>
            <ListItemIcon>
              <LocalPharmacy />
            </ListItemIcon>
            <ListItemText primary="Pharmacy" />
            {openPharmacy ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openPharmacy} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/pharmacy/medicines')} selected={location.pathname.startsWith('/pharmacy/medicines')}>
              <ListItemText primary="Medicines" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/pharmacy/batches')} selected={location.pathname.startsWith('/pharmacy/batches')}>
              <ListItemText primary="Batches" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/pharmacy/sales')} selected={location.pathname.startsWith('/pharmacy/sales')}>
              <ListItemText primary="Sales" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/pharmacy/returns')} selected={location.pathname.startsWith('/pharmacy/returns')}>
              <ListItemText primary="Returns" />
            </ListItemButton>
          </List>
        </Collapse>
        {/* Billing Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenBilling((prev) => !prev)}>
            <ListItemIcon>
              <ReceiptLong />
            </ListItemIcon>
            <ListItemText primary="Billing" />
            {openBilling ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openBilling} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/billing')} selected={location.pathname === '/billing'}>
              <ListItemText primary="All Bills" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/billing/payments')} selected={location.pathname.startsWith('/billing/payments')}>
              <ListItemText primary="Payments" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/billing/insurance-claims')} selected={location.pathname.startsWith('/billing/insurance-claims')}>
              <ListItemText primary="Insurance Claims" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <RegisterPatientModal open={openRegister} onClose={() => setOpenRegister(false)} onSuccess={onPatientRegistered} />
      <BookAppointmentModal open={openBookAppointment} onClose={() => setOpenBookAppointment(false)} onSuccess={onAppointmentBooked} />
      <AdmitPatientModal open={openAdmitPatient} onClose={() => setOpenAdmitPatient(false)} onSuccess={() => setAdmitRefreshKey(k => k + 1)} />
      <AddWardModal open={openAddWard} onClose={() => setOpenAddWard(false)} onSuccess={onPatientRegistered} />
      <AddVitalsModal open={openAddVitals} onClose={() => setOpenAddVitals(false)} />
      <AddDoctorRoundModal open={openAddDoctorRound} onClose={() => setOpenAddDoctorRound(false)} />
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
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hospital Management System
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              onClick={handleMenuClick}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {openIpd && <AdmittedPatientsList refreshKey={admitRefreshKey} />}
        </Box>
        {/* In-app pharmacy alert banners */}
        {pharmacyLoading && <CircularProgress size={20} sx={{ mb: 2 }} />}
        {pharmacyError && <Alert severity="error" sx={{ mb: 2 }}>{pharmacyError}</Alert>}
        {lowStock.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Low Stock Alert:</strong>
            {lowStock.map(batch => (
              <span key={batch.id} style={{ marginLeft: 8 }}>
                {batch.medicine.name} (Batch: {batch.batchNumber}) - Qty: {batch.quantity}
              </span>
            ))}
          </Alert>
        )}
        {expiring.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Expiring Soon:</strong>
            {expiring.map(batch => (
              <span key={batch.id} style={{ marginLeft: 8 }}>
                {batch.medicine.name} (Batch: {batch.batchNumber}) - Expiry: {batch.expiryDate}
              </span>
            ))}
          </Alert>
        )}
        {/* In-app billing alert banners */}
        {billingLoading && <CircularProgress size={20} sx={{ mb: 2 }} />}
        {billingError && <Alert severity="error" sx={{ mb: 2 }}>{billingError}</Alert>}
        {pendingBills.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Pending Bills:</strong>
            {pendingBills.map(bill => (
              <span key={bill.id} style={{ marginLeft: 8 }}>
                Bill #{bill.id} (Patient ID: {bill.patientId}) - Due: ₹{bill.totalAmount - (bill.paidAmount || 0)}
              </span>
            ))}
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
};