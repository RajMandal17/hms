import React, { useEffect, useState } from 'react';
import { getClaimsByPatient, submitClaim, updateClaimStatus, uploadClaimDocument, getClaimDocuments } from '../services/insuranceClaimService';
import { getAllBills } from '../services/billingService';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, IconButton, Chip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';

const userRole = localStorage.getItem('role') || 'PATIENT';
const userId = Number(localStorage.getItem('userId')) || 1;

type Claim = {
  id: number;
  bill?: { id: number };
  tpaName: string;
  claimNumber: string;
  claimedAmount: number;
  status: string;
  remarks?: string;
  submittedAt?: string;
  updatedAt?: string;
};

type Bill = { id: number; totalAmount: number };

type ClaimDoc = { id: number; fileUrl: string; uploadedBy: string };

const BillingInsuranceClaims: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [addForm, setAddForm] = useState({ billId: '', tpaName: '', claimNumber: '', claimedAmount: '', remarks: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [docUploading, setDocUploading] = useState(false);
  const [claimDocs, setClaimDocs] = useState<ClaimDoc[]>([]);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
    if (userRole !== 'PATIENT') fetchBills();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await getClaimsByPatient(userId);
      setClaims(res.data);
    } catch {
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchBills = async () => {
    try {
      const res = await getAllBills();
      setBills(res.data);
    } catch {
      setBills([]);
    }
  };

  const handleAddOpen = () => {
    setAddForm({ billId: '', tpaName: '', claimNumber: '', claimedAmount: '', remarks: '' });
    setAddError(null);
    setOpenAdd(true);
  };
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddSubmit = async () => {
    setAddLoading(true);
    setAddError(null);
    try {
      await submitClaim({
        bill: { id: Number(addForm.billId) },
        tpaName: addForm.tpaName,
        claimNumber: addForm.claimNumber,
        claimedAmount: Number(addForm.claimedAmount),
        remarks: addForm.remarks,
      });
      setOpenAdd(false);
      fetchClaims();
    } catch {
      setAddError('Failed to submit claim');
    } finally {
      setAddLoading(false);
    }
  };
  const handleViewClaim = async (claim: Claim) => {
    setSelectedClaim(claim);
    setClaimDocs([]);
    try {
      const res = await getClaimDocuments(claim.id);
      setClaimDocs(res.data);
    } catch {
      setClaimDocs([]);
    }
  };
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocFiles(Array.from(e.target.files));
  };
  const handleDocUpload = async () => {
    if (!selectedClaim || docFiles.length === 0) return;
    setDocUploading(true);
    try {
      for (const file of docFiles) {
        await uploadClaimDocument(selectedClaim.id, file);
      }
      const res = await getClaimDocuments(selectedClaim.id);
      setClaimDocs(res.data);
      setDocFiles([]);
    } catch {}
    setDocUploading(false);
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusForm({ ...statusForm, [e.target.name]: e.target.value });
  };
  const handleStatusUpdate = async () => {
    if (!selectedClaim) return;
    setStatusLoading(true);
    try {
      await updateClaimStatus(selectedClaim.id, statusForm.status, statusForm.remarks);
      fetchClaims();
      setSelectedClaim({ ...selectedClaim, status: statusForm.status, remarks: statusForm.remarks });
    } catch {}
    setStatusLoading(false);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Insurance Claims</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddOpen}>Submit New Claim</Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bill</TableCell>
                <TableCell>TPA</TableCell>
                <TableCell>Claim #</TableCell>
                <TableCell>Claimed</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>{claim.bill?.id}</TableCell>
                  <TableCell>{claim.tpaName}</TableCell>
                  <TableCell>{claim.claimNumber}</TableCell>
                  <TableCell>{claim.claimedAmount}</TableCell>
                  <TableCell><Chip label={claim.status} color={claim.status === 'APPROVED' ? 'success' : claim.status === 'REJECTED' ? 'error' : 'warning'} /></TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewClaim(claim)}><VisibilityIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Add Claim Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Submit Insurance Claim</DialogTitle>
        <DialogContent>
          <TextField select margin="dense" label="Bill" name="billId" value={addForm.billId} onChange={handleAddChange} fullWidth required>
            {bills.map((b) => (
              <MenuItem key={b.id} value={b.id}>Bill #{b.id} (₹{b.totalAmount})</MenuItem>
            ))}
          </TextField>
          <TextField margin="dense" label="TPA Name" name="tpaName" value={addForm.tpaName} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Claim Number" name="claimNumber" value={addForm.claimNumber} onChange={handleAddChange} fullWidth required />
          <TextField margin="dense" label="Claimed Amount" name="claimedAmount" value={addForm.claimedAmount} onChange={handleAddChange} type="number" fullWidth required />
          <TextField margin="dense" label="Remarks" name="remarks" value={addForm.remarks} onChange={handleAddChange} fullWidth />
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>{addLoading ? 'Submitting...' : 'Submit'}</Button>
        </DialogActions>
      </Dialog>
      {/* Claim Details Dialog */}
      <Dialog open={!!selectedClaim} onClose={() => setSelectedClaim(null)} maxWidth="md" fullWidth>
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <React.Fragment>
              <Typography>Bill: {selectedClaim.bill?.id}</Typography>
              <Typography>TPA: {selectedClaim.tpaName}</Typography>
              <Typography>Claim #: {selectedClaim.claimNumber}</Typography>
              <Typography>Claimed: ₹{selectedClaim.claimedAmount}</Typography>
              <Typography>Status: {selectedClaim.status}</Typography>
              <Typography>Remarks: {selectedClaim.remarks}</Typography>
              <Typography>Submitted: {selectedClaim.submittedAt}</Typography>
              <Typography>Updated: {selectedClaim.updatedAt}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Documents</Typography>
              <ul>
                {claimDocs.map((doc) => (
                  <li key={doc.id}><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">{doc.fileUrl.split('/').pop()}</a> (by {doc.uploadedBy})</li>
                ))}
              </ul>
              <input type="file" multiple onChange={handleDocChange} />
              <Button onClick={handleDocUpload} variant="outlined" startIcon={<CloudUploadIcon />} disabled={docUploading || docFiles.length === 0} sx={{ mt: 1 }}>{docUploading ? 'Uploading...' : 'Upload'}</Button>
              {userRole !== 'PATIENT' && (
                <React.Fragment>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Update Status</Typography>
                  <TextField select margin="dense" label="Status" name="status" value={statusForm.status} onChange={handleStatusChange} fullWidth>
                    <MenuItem value="SUBMITTED">SUBMITTED</MenuItem>
                    <MenuItem value="UNDER_REVIEW">UNDER REVIEW</MenuItem>
                    <MenuItem value="APPROVED">APPROVED</MenuItem>
                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                    <MenuItem value="PAID">PAID</MenuItem>
                  </TextField>
                  <TextField margin="dense" label="Remarks" name="remarks" value={statusForm.remarks} onChange={handleStatusChange} fullWidth />
                  <Button onClick={handleStatusUpdate} variant="contained" disabled={statusLoading} sx={{ mt: 1 }}>{statusLoading ? 'Updating...' : 'Update'}</Button>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedClaim(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BillingInsuranceClaims;
