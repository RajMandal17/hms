import React, { useState } from 'react';
import { getAllBills, Bill } from '../services/billingService';
import { processRefund, getRefundsByBill, Refund } from '../services/refundService';
import { AxiosResponse } from 'axios';

const BillingRefunds: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    getAllBills().then((res) => setBills(res.data as Bill[]));
  }, []);

  const handleSelectBill = async (bill: Bill) => {
    setSelectedBill(bill);
    setMessage('');
    setAmount('');
    setReason('');
    const res = await getRefundsByBill(bill.id!);
    setRefunds(res.data as Refund[]);
  };

  const handleRefund = async () => {
    if (!selectedBill || !amount || !reason) return;
    setLoading(true);
    setMessage('');
    try {
      await processRefund(selectedBill.id!, Number(amount), reason, 'currentUser'); // Replace with real user
      setMessage('Refund processed successfully');
      setAmount('');
      setReason('');
      const res = await getRefundsByBill(selectedBill.id!);
      setRefunds(res.data as Refund[]);
    } catch (e: any) {
      setMessage(e?.response?.data || 'Refund failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Billing Refunds</h2>
      <div className="mb-6">
        <h3 className="font-semibold">All Bills</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">ID</th>
              <th className="border px-2">Patient</th>
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
                <td className="border px-2">{bill.patientName || '-'}</td>
                <td className="border px-2">{bill.totalAmount}</td>
                <td className="border px-2">{bill.paidAmount}</td>
                <td className="border px-2">{bill.status}</td>
                <td className="border px-2">
                  <button onClick={() => handleSelectBill(bill)} className="text-blue-600 mr-2">Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedBill && (
        <div className="mb-6">
          <h3 className="font-semibold">Refund for Bill #{selectedBill.id}</h3>
          <div className="mb-2">
            <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="border p-1 m-1" />
            <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} className="border p-1 m-1" />
            <button onClick={handleRefund} className="bg-red-500 text-white px-2 py-1 rounded" disabled={loading}>Refund</button>
          </div>
          {message && <div className="mb-2 text-sm text-red-600">{message}</div>}
          <div>
            <h4 className="font-medium">Refund History</h4>
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2">ID</th>
                  <th className="border px-2">Amount</th>
                  <th className="border px-2">Reason</th>
                  <th className="border px-2">Processed By</th>
                  <th className="border px-2">At</th>
                  <th className="border px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map(r => (
                  <tr key={r.id}>
                    <td className="border px-2">{r.id}</td>
                    <td className="border px-2">{r.amount}</td>
                    <td className="border px-2">{r.reason}</td>
                    <td className="border px-2">{r.processedBy}</td>
                    <td className="border px-2">{r.processedAt}</td>
                    <td className="border px-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingRefunds;
