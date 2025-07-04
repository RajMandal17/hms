import React, { useEffect, useState } from 'react';
import { Bill, InsuranceClaim, createBill, getAllBills, claimInsurance, downloadBillPdf } from '../services/billingService';
import { Payment, recordPayment } from '../services/paymentService';
import { patientService } from '../services/patientService';
import { ConsultationService } from '../services/consultationService';
import { ipdService } from '../services/ipdService';
import { getSales } from '../services/pharmacySalesService';
import { Patient, Consultation } from '../types';

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
  const [walkInDetails, setWalkInDetails] = useState<any>({ name: '', expenses: [{ description: '', amount: 0 }] });

  useEffect(() => {
    patientService.getPatients().then((data: Patient[]) => setPatients(data));
    getAllBills().then(res => setBills(res.data as Bill[]));
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setIsWalkIn(false);
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
    }
  }, [selectedPatient]);

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

  const handleMakePayment = async () => {
    if (!selectedBill || !payment.amount || !payment.mode) return;
    const paymentData: Payment = {
      amount: payment.amount,
      mode: payment.mode,
      bill: selectedBill.id,
      patientId: selectedBill.patientId,
      reference: payment.reference || '',
    };
    await recordPayment(paymentData);
    const res = await getAllBills();
    setBills(res.data as Bill[]);
    setPayment({});
  };

  const handleClaimInsurance = async () => {
    if (!selectedBill || !insurance.tpaName || !insurance.claimNumber || !insurance.claimedAmount) return;
    await claimInsurance(selectedBill.id!, insurance as InsuranceClaim);
    const res = await getAllBills();
    setBills(res.data as Bill[]);
    setInsurance({});
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
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
            <option value="walkin">Walk-in (Pharmacy Only)</option>
          </select>
        </div>
        {isWalkIn ? (
          <div className="mb-2">
            <input placeholder="Name" value={walkInDetails.name} onChange={e => setWalkInDetails({ ...walkInDetails, name: e.target.value })} className="border p-1 m-1" />
            <div>
              <h4 className="font-medium">Expenses</h4>
              {walkInDetails.expenses.map((exp: any, idx: number) => (
                <div key={idx} className="flex mb-1">
                  <input placeholder="Description" value={exp.description} onChange={e => {
                    const newExps = [...walkInDetails.expenses];
                    newExps[idx].description = e.target.value;
                    setWalkInDetails({ ...walkInDetails, expenses: newExps });
                  }} className="border p-1 mr-1" />
                  <input placeholder="Amount" type="number" value={exp.amount} onChange={e => {
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
          </div>
        ) : selectedPatient && (
          <div className="mb-2">
            <div className="mb-1">Name: {selectedPatient.firstName} {selectedPatient.lastName}</div>
            <div className="mb-1">Gender: {selectedPatient.gender}</div>
            <div className="mb-1">DOB: {selectedPatient.dateOfBirth}</div>
            <div className="mb-1">Phone: {selectedPatient.phone}</div>
            <div className="mb-1">Email: {selectedPatient.email}</div>
            <h4 className="font-medium mt-2">Expenses</h4>
            <table className="min-w-full border mb-2">
              <thead>
                <tr>
                  <th className="border px-2">Type</th>
                  <th className="border px-2">Description</th>
                  <th className="border px-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {patientExpenses.map((exp, idx) => (
                  <tr key={idx}>
                    <td className="border px-2">{exp.type}</td>
                    <td className="border px-2">{exp.description}</td>
                    <td className="border px-2">{exp.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="font-semibold">Total: {totalExpenses}</div>
          </div>
        )}
        <button
          onClick={async () => {
            if (isWalkIn) {
              if (!walkInDetails.name || walkInDetails.expenses.length === 0) return alert('Enter walk-in details and at least one expense');
              const total = walkInDetails.expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
              const res = await createBill({
                patientId: undefined,
                patientName: walkInDetails.name,
                billType: 'Pharmacy',
                totalAmount: total,
                items: walkInDetails.expenses.map((e: any) => ({ description: e.description, amount: e.amount }))
              } as any);
              setBills([...bills, res.data as Bill]);
              setWalkInDetails({ name: '', expenses: [{ description: '', amount: 0 }] });
            } else if (selectedPatient) {
              if (patientExpenses.length === 0) return alert('No expenses found for this patient');
              const res = await createBill({
                patientId: selectedPatient.id,
                billType: 'All',
                totalAmount: totalExpenses,
                items: patientExpenses.map(e => ({ description: `${e.type}: ${e.description}`, amount: e.amount }))
              } as any);
              setBills([...bills, res.data as Bill]);
              setSelectedPatient(null);
            }
          }}
          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
        >Create Bill</button>
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
                  <button onClick={() => setSelectedBill(bill)} className="text-blue-600 mr-2">Select</button>
                  <button onClick={() => handleDownloadPdf(bill.id!)} className="text-green-600">Download PDF</button>
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
