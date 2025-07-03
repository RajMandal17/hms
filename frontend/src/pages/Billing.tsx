import React, { useEffect, useState } from 'react';
import { Bill, BillItem, InsuranceClaim, createBill, getAllBills, claimInsurance, downloadBillPdf } from '../services/billingService';
import { Payment, recordPayment } from '../services/paymentService';
import { exportBillToPdf } from '../utils/pdfExport';

const handleDownloadPdf = async (billId: number) => {
    try {
      const res = await downloadBillPdf(billId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
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

const Billing: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [newBill, setNewBill] = useState<Partial<Bill>>({ items: [] });
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payment, setPayment] = useState<Partial<Payment>>({});
  const [insurance, setInsurance] = useState<Partial<InsuranceClaim>>({});

  useEffect(() => {
    getAllBills().then(res => setBills(res.data));
  }, []);

  const handleCreateBill = async () => {
    if (!newBill.patientId || !newBill.billType || !newBill.totalAmount) return;
    const res = await createBill(newBill as Bill);
    setBills([...bills, res.data]);
    setNewBill({ items: [] });
  };

  const handleSelectBill = (bill: Bill) => setSelectedBill(bill);

  const handleMakePayment = async () => {
    if (!selectedBill || !payment.amount || !payment.mode) return;
    // Construct payment object for new endpoint
    const paymentData: Payment = {
      amount: payment.amount,
      mode: payment.mode,
      bill: selectedBill.id, // Pass bill id as per Payment interface
      patientId: selectedBill.patientId,
      reference: payment.reference || '',
    };
    await recordPayment(paymentData);
    const res = await getAllBills();
    setBills(res.data);
    setPayment({});
  };

  const handleClaimInsurance = async () => {
    if (!selectedBill || !insurance.tpaName || !insurance.claimNumber || !insurance.claimedAmount) return;
    await claimInsurance(selectedBill.id!, insurance as InsuranceClaim);
    const res = await getAllBills();
    setBills(res.data);
    setInsurance({});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Billing</h2>
      <div className="mb-6">
        <h3 className="font-semibold">Create Bill</h3>
        <input placeholder="Patient ID" type="number" value={newBill.patientId || ''} onChange={e => setNewBill({ ...newBill, patientId: Number(e.target.value) })} className="border p-1 m-1" />
        <input placeholder="Bill Type" value={newBill.billType || ''} onChange={e => setNewBill({ ...newBill, billType: e.target.value })} className="border p-1 m-1" />
        <input placeholder="Total Amount" type="number" value={newBill.totalAmount || ''} onChange={e => setNewBill({ ...newBill, totalAmount: Number(e.target.value) })} className="border p-1 m-1" />
        <button onClick={handleCreateBill} className="bg-blue-500 text-white px-2 py-1 rounded">Create</button>
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
            {bills.map(bill => (
              <tr key={bill.id} className={selectedBill?.id === bill.id ? 'bg-gray-100' : ''}>
                <td className="border px-2">{bill.id}</td>
                <td className="border px-2">{bill.patientId}</td>
                <td className="border px-2">{bill.billType}</td>
                <td className="border px-2">{bill.totalAmount}</td>
                <td className="border px-2">{bill.paidAmount}</td>
                <td className="border px-2">{bill.status}</td>
                <td className="border px-2">
                  <button onClick={() => handleSelectBill(bill)} className="text-blue-600 mr-2">Select</button>
                  <button onClick={() => handleDownloadPdf(bill.id!)} className="text-green-600">Download PDF</button>
                  <button onClick={() => exportBillToPdf(bill)} className="text-purple-600 ml-2">Export PDF (Local)</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedBill && (
        <div className="mb-6">
          <h3 className="font-semibold">Selected Bill: #{selectedBill.id}</h3>
          <div className="mb-2">
            <h4 className="font-medium">Make Payment</h4>
            <input placeholder="Amount" type="number" value={payment.amount || ''} onChange={e => setPayment({ ...payment, amount: Number(e.target.value) })} className="border p-1 m-1" />
            <input placeholder="Mode" value={payment.mode || ''} onChange={e => setPayment({ ...payment, mode: e.target.value })} className="border p-1 m-1" />
            <button onClick={handleMakePayment} className="bg-green-500 text-white px-2 py-1 rounded">Pay</button>
          </div>
          <div className="mb-2">
            <h4 className="font-medium">Claim Insurance</h4>
            <input placeholder="TPA Name" value={insurance.tpaName || ''} onChange={e => setInsurance({ ...insurance, tpaName: e.target.value })} className="border p-1 m-1" />
            <input placeholder="Claim Number" value={insurance.claimNumber || ''} onChange={e => setInsurance({ ...insurance, claimNumber: e.target.value })} className="border p-1 m-1" />
            <input placeholder="Claimed Amount" type="number" value={insurance.claimedAmount || ''} onChange={e => setInsurance({ ...insurance, claimedAmount: Number(e.target.value) })} className="border p-1 m-1" />
            <button onClick={handleClaimInsurance} className="bg-purple-500 text-white px-2 py-1 rounded">Claim</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
