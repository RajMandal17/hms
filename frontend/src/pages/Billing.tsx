import React, { useEffect, useState } from 'react';
import { Bill, InsuranceClaim, createBill, getAllBills, claimInsurance, downloadBillPdf, getBillsByPatient } from '../services/billingService';
import { Payment, recordPayment } from '../services/paymentService';
import { patientService } from '../services/patientService';
import { ConsultationService } from '../services/consultationService';
import { ipdService } from '../services/ipdService';
import { getSales } from '../services/pharmacySalesService';
import { Patient, Consultation } from '../types';
import {
  getClaimsByPatient,
  getClaimDocuments,
  uploadClaimDocument
} from '../services/insuranceClaimService';

const consultationService = new ConsultationService();

const Billing: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payment, setPayment] = useState<Partial<Payment>>({});
  const [insurance, setInsurance] = useState<Partial<InsuranceClaim>>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientExpenses, setPatientExpenses] = useState<any[]>([]); // [{type, description, amount}]
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [isWalkIn, setIsWalkIn] = useState<boolean>(false);
  const [walkInDetails, setWalkInDetails] = useState<any>({ name: '', phone: '', address: '', expenses: [{ description: '', amount: 0 }] });
  const [walkInError, setWalkInError] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [claimDocuments, setClaimDocuments] = useState<any[]>([]);
  const [docUploadLoading, setDocUploadLoading] = useState(false);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);
  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    patientService.getPatients().then((data: Patient[]) => setPatients(data));
    getAllBills().then(res => setBills(Array.isArray(res.data) ? res.data : []));
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setIsWalkIn(false);
      // Fetch bills for selected patient
      getBillsByPatient(selectedPatient.id).then(res => {
        setBills(Array.isArray(res.data) ? res.data : []);
      });
      // Fetch pending bills for this patient
      fetch(`/api/billing/bills/pending?patientId=${selectedPatient.id}`)
        .then(res => res.json())
        .then(data => {
          // You can handle pending bills here if needed
          // Example: setPendingBills(data);
        })
        .catch(() => {/* handle error if needed */});
      // Fetch expenses
      Promise.all([
        consultationService.getConsultationsByPatientId(selectedPatient.id),
        ipdService.getAdmissions(),
        getSales()
      ]).then(([consultations, admissions, sales]) => {
        // OPD expenses
        const opdExpenses = (consultations || []).map((c: Consultation) => ({
          type: 'OPD',
          description: c.diagnosis || 'Consultation',
          amount: 0 // No fee property, set to 0 or add if available
        }));
        // IPD expenses (filter by patient)
        const ipdExpenses = (admissions || [])
          .filter((a: any) => a.patientId === selectedPatient.id)
          .map((a: any) => ({
            type: 'IPD',
            description: a.diagnosis || 'Admission',
            amount: a.totalAmount || 0
          }));
        // Pharmacy expenses (filter by patient)
        const pharmacyExpenses = (sales || [])
          .filter((s: any) => s.patientId === selectedPatient.id)
          .map((s: any) => ({
            type: 'Pharmacy',
            description: 'Pharmacy Sale',
            amount: s.totalAmount || 0
          }));
        const allExpenses = [...opdExpenses, ...ipdExpenses, ...pharmacyExpenses];
        setPatientExpenses(allExpenses);
        setTotalExpenses(allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0));
      });
    } else {
      setPatientExpenses([]);
      setTotalExpenses(0);
      setBills([]);
    }
  }, [selectedPatient]);

  // Fetch insurance claims for selected bill
  useEffect(() => {
    if (selectedBill) {
      setClaimLoading(true);
      setClaimError(null);
      setInsuranceClaims([]);
      getClaimsByPatient(selectedBill.patientId ?? 0)
        .then(res => {
          // Filter claims for this bill
          const claims = Array.isArray(res.data) ? res.data.filter((c: any) => c.billId === selectedBill.id) : [];
          setInsuranceClaims(claims);
          setClaimLoading(false);
        })
        .catch(() => {
          setClaimError('Failed to fetch insurance claims');
          setClaimLoading(false);
        });
    } else {
      setInsuranceClaims([]);
    }
  }, [selectedBill]);

  // Fetch claim documents when a claim is selected
  useEffect(() => {
    if (selectedClaim) {
      setClaimDocuments([]);
      getClaimDocuments(selectedClaim.id!)
        .then(res => setClaimDocuments(Array.isArray(res.data) ? res.data : []))
        .catch(() => setClaimDocuments([]));
    } else {
      setClaimDocuments([]);
    }
  }, [selectedClaim]);

  // Reset selectedClaim and claimSuccess when selectedBill changes
  useEffect(() => {
    setSelectedClaim(null);
    setClaimSuccess(null);
  }, [selectedBill]);

  const handleDownloadPdf = async (billId: number) => {
    try {
      const res = await downloadBillPdf(billId);
      const url = window.URL.createObjectURL(new Blob([res.data as any], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      alert('Failed to download PDF');
    }
  };

  const handleClaimInsurance = async () => {
    if (!selectedBill || !insurance.tpaName || !insurance.claimNumber || !insurance.claimedAmount) return;
    await claimInsurance(selectedBill.id!, insurance as InsuranceClaim);
    const res = await getAllBills();
    setBills(Array.isArray(res.data) ? res.data : []);
    setInsurance({});
  };

  // Add document upload handler
  const handleUploadDocument = async (claimId: number, file: File) => {
    setDocUploadLoading(true);
    setDocUploadError(null);
    setDocUploadSuccess(null);
    try {
      await uploadClaimDocument(claimId, file);
      setDocUploadSuccess('Document uploaded successfully');
      // Refresh documents
      const res = await getClaimDocuments(claimId);
      setClaimDocuments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setDocUploadError('Failed to upload document');
    } finally {
      setDocUploadLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Billing</h2>
      <div className="mb-6">
        <h3 className="font-semibold">Create Bill</h3>
        <div className="mb-2">
          <label className="mr-2">Patient:</label>
          <select
            value={isWalkIn ? 'walkin' : selectedPatient?.id || ''}
            onChange={e => {
              if (e.target.value === 'walkin') {
                setIsWalkIn(true);
                setSelectedPatient(null);
              } else {
                setIsWalkIn(false);
                const patient = patients.find(p => p.id === Number(e.target.value));
                setSelectedPatient(patient || null);
              }
            }}
            className="border p-1 m-1"
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="walkin">Walk-in (Pharmacy Only)</option>
          </select>
        </div>
        {isWalkIn ? (
          <div className="mb-2">
            <input placeholder="Name" value={walkInDetails.name} onChange={e => setWalkInDetails({ ...walkInDetails, name: e.target.value })} className="border p-1 m-1" />
            <input placeholder="Phone" value={walkInDetails.phone || ''} onChange={e => setWalkInDetails({ ...walkInDetails, phone: e.target.value })} className="border p-1 m-1" />
            <input placeholder="Address" value={walkInDetails.address || ''} onChange={e => setWalkInDetails({ ...walkInDetails, address: e.target.value })} className="border p-1 m-1" />
            <div>
              <h4 className="font-medium">Expenses</h4>
              {walkInDetails.expenses.map((exp: any, idx: number) => (
                <div key={idx} className="flex mb-1">
                  <input placeholder="Description" value={exp.description} onChange={e => {
                    const newExps = [...walkInDetails.expenses];
                    newExps[idx].description = e.target.value;
                    setWalkInDetails({ ...walkInDetails, expenses: newExps });
                  }} className="border p-1 mr-1" />
                  <input placeholder="Amount" type="number" min="0" value={exp.amount} onChange={e => {
                    const newExps = [...walkInDetails.expenses];
                    newExps[idx].amount = Number(e.target.value);
                    setWalkInDetails({ ...walkInDetails, expenses: newExps });
                  }} className="border p-1 mr-1" />
                  <button onClick={() => {
                    const newExps = walkInDetails.expenses.filter((_: any, i: number) => i !== idx);
                    setWalkInDetails({ ...walkInDetails, expenses: newExps });
                  }} className="text-red-500">Remove</button>
                </div>
              ))}
              <button onClick={() => setWalkInDetails({ ...walkInDetails, expenses: [...walkInDetails.expenses, { description: '', amount: 0 }] })} className="text-blue-500">Add Expense</button>
            </div>
            <div className="mt-2 font-semibold">Total: {walkInDetails.expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0)}</div>
            {walkInError && <div className="text-red-500 mt-1">{walkInError}</div>}
          </div>
        ) : selectedPatient && (
          <div className="mb-2">
            <div className="mb-1">Name: {selectedPatient.name || ''}</div>
            <div className="mb-1">Gender: {selectedPatient.gender || 'N/A'}</div>
            <div className="mb-1">Phone: {selectedPatient.contact || 'N/A'}</div>
            <div className="mb-1">Email: {selectedPatient.email || 'N/A'}</div>
            <h4 className="font-medium mt-2">Bill Totals</h4>
            {(() => {
              const opdTotal = bills.filter(b => b.patientId === selectedPatient.id && b.billType && b.billType.toUpperCase().includes('OPD')).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
              const ipdTotal = bills.filter(b => b.patientId === selectedPatient.id && b.billType && b.billType.toUpperCase().includes('IPD')).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
              const pharmacyTotal = bills.filter(b => b.patientId === selectedPatient.id && b.billType && b.billType.toUpperCase().includes('PHARMACY')).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
              const total = opdTotal + ipdTotal + pharmacyTotal;
              return (
                <div>
                  <div className="mb-1">OPD Total: <b>{opdTotal}</b></div>
                  <div className="mb-1">IPD Total: <b>{ipdTotal}</b></div>
                  <div className="mb-1">Pharmacy Total: <b>{pharmacyTotal}</b></div>
                  <div className="mb-1">Grand Total: <b>{total}</b></div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold">All Bills</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">ID</th>
              <th className="border px-2">Patient</th>
              <th className="border px-2">Type</th>
              <th className="border px-2">Total</th>
              <th className="border px-2">Paid</th>
              <th className="border px-2">Status</th>
              <th className="border px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-2">No bills found.</td>
              </tr>
            ) : (
              bills.map(bill => {
                // Use patientName from BillDTO for both registered and walk-in
                const patientDisplay = patients.find(p => p.id === bill.patientId)?.name || '-';
                return (
                  <tr key={bill.id} className={selectedBill?.id === bill.id ? 'bg-gray-100' : ''}>
                    <td className="border px-2">{bill.id}</td>
                    <td className="border px-2">{patientDisplay}</td>
                    <td className="border px-2">{bill.billType}</td>
                    <td className="border px-2">{bill.totalAmount}</td>
                    <td className="border px-2">{bill.paidAmount}</td>
                    <td className="border px-2">{bill.status}</td>
                    <td className="border px-2">
                      <button onClick={() => setSelectedBill(bill)} className="text-blue-600 mr-2">Select</button>
                      <button onClick={() => handleDownloadPdf(bill.id!)} className="text-green-600">Download PDF</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* Debug: Show bills data */}
        {/* <pre className="text-xs text-gray-400">{JSON.stringify(bills, null, 2)}</pre> */}
      </div>
      {selectedBill && (
        <div className="mb-6">
          <h3 className="font-semibold">Selected Bill: #{selectedBill.id}</h3>
          <div className="mb-2">
            <h4 className="font-medium">Make Payment</h4>
            <input placeholder="Amount" type="number" value={payment.amount || ''} onChange={e => setPayment({ ...payment, amount: Number(e.target.value) })} className="border p-1 m-1" />
            <input placeholder="Mode" value={payment.mode || ''} onChange={e => setPayment({ ...payment, mode: e.target.value })} className="border p-1 m-1" />
            <button
              onClick={async () => {
                setPaymentLoading(true);
                setPaymentError(null);
                try {
                  if (!selectedBill || !payment.amount || !payment.mode) return;
                  const paymentData: Payment = {
                    amount: payment.amount!,
                    mode: payment.mode!,
                    bill: { id: selectedBill.id! },
                    patientId: selectedBill.patientId,
                    reference: payment.reference || '',
                  };
                  await recordPayment(paymentData);
                  // Fetch updated bills to reflect new status
                  const res = await getAllBills();
                  setBills(Array.isArray(res.data) ? res.data : []);
                  setPayment({});
                  setSelectedBill(null); // Optionally deselect after payment
                } catch (e) {
                  setPaymentError('Failed to make payment');
                } finally {
                  setPaymentLoading(false);
                }
              }}
              className="bg-green-500 text-white px-2 py-1 rounded"
              disabled={paymentLoading || (selectedBill && selectedBill.status === 'PAID')}
            >
              {paymentLoading ? 'Processing...' : 'Pay'}
            </button>
            {paymentError && <span className="text-red-500 ml-2">{paymentError}</span>}
          </div>
          <div className="mb-2">
            <h4 className="font-medium">Insurance Claims</h4>
            {claimLoading && <div className="text-blue-500">Loading claims...</div>}
            {claimError && <div className="text-red-500">{claimError}</div>}
            {claimSuccess && <div className="text-green-500">{claimSuccess}</div>}
            {/* List existing claims for this bill */}
            {insuranceClaims.length > 0 ? (
              <table className="min-w-full border mb-2">
                <thead>
                  <tr>
                    <th className="border px-2">TPA Name</th>
                    <th className="border px-2">Claim Number</th>
                    <th className="border px-2">Claimed Amount</th>
                    <th className="border px-2">Status</th>
                    <th className="border px-2">Remarks</th>
                    <th className="border px-2">Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {insuranceClaims.map(claim => (
                    <tr key={claim.id} className={selectedClaim?.id === claim.id ? 'bg-gray-100' : ''}>
                      <td className="border px-2">{claim.tpaName}</td>
                      <td className="border px-2">{claim.claimNumber}</td>
                      <td className="border px-2">{claim.claimedAmount}</td>
                      <td className="border px-2">{claim.status}</td>
                      <td className="border px-2">{claim.remarks || '-'}</td>
                      <td className="border px-2">
                        <button onClick={() => setSelectedClaim(claim)} className="text-blue-600">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No insurance claims for this bill.</div>
            )}
            {/* Show claim details and document upload if a claim is selected */}
            {selectedClaim && (
              <div className="border p-2 mt-2">
                <div className="font-semibold">Claim #{selectedClaim.id}</div>
                <div>Status: {selectedClaim.status}</div>
                <div>Remarks: {selectedClaim.remarks || '-'}</div>
                <div className="mt-2">
                  <div className="font-medium">Documents</div>
                  {claimDocuments.length > 0 ? (
                    <ul>
                      {claimDocuments.map(doc => (
                        <li key={doc.id}>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.fileName}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No documents uploaded.</div>
                  )}
                  <div className="mt-2">
                    <input type="file" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadDocument(selectedClaim.id!, e.target.files[0]);
                        e.target.value = '';
                      }
                    }} disabled={docUploadLoading} />
                    {docUploadLoading && <span className="text-blue-500 ml-2">Uploading...</span>}
                    {docUploadError && <span className="text-red-500 ml-2">{docUploadError}</span>}
                    {docUploadSuccess && <span className="text-green-500 ml-2">{docUploadSuccess}</span>}
                  </div>
                </div>
                <button onClick={() => setSelectedClaim(null)} className="text-gray-600 mt-2">Close</button>
              </div>
            )}
            {/* ...existing claim submission form... */}
            <div className="mt-4">
              <h5 className="font-medium">Submit New Insurance Claim</h5>
              <input placeholder="TPA Name" value={insurance.tpaName || ''} onChange={e => setInsurance({ ...insurance, tpaName: e.target.value })} className="border p-1 m-1" />
              <input placeholder="Claim Number" value={insurance.claimNumber || ''} onChange={e => setInsurance({ ...insurance, claimNumber: e.target.value })} className="border p-1 m-1" />
              <input placeholder="Claimed Amount" type="number" value={insurance.claimedAmount || ''} onChange={e => setInsurance({ ...insurance, claimedAmount: Number(e.target.value) })} className="border p-1 m-1" />
              <button
                onClick={async () => {
                  if (!selectedBill || !insurance.tpaName || !insurance.claimNumber || !insurance.claimedAmount) return;
                  setClaimLoading(true);
                  setClaimError(null);
                  setClaimSuccess(null);
                  try {
                    await claimInsurance(selectedBill.id!, insurance as InsuranceClaim);
                    setClaimSuccess('Insurance claim submitted');
                    // Refresh claims
                    const res = await getClaimsByPatient(selectedBill.patientId);
                    const claims = Array.isArray(res.data) ? res.data.filter((c: any) => c.billId === selectedBill.id) : [];
                    setInsuranceClaims(claims);
                    setInsurance({});
                  } catch (e) {
                    setClaimError('Failed to submit insurance claim');
                  } finally {
                    setClaimLoading(false);
                  }
                }}
                className="bg-purple-500 text-white px-2 py-1 rounded"
                disabled={claimLoading}
              >Claim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
