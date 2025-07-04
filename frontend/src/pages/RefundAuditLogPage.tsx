import React from 'react';
import { getAllRefundAuditLogs, RefundAuditLog } from '../services/refundAuditService';

const RefundAuditLogPage: React.FC = () => {
  const [logs, setLogs] = React.useState<RefundAuditLog[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    getAllRefundAuditLogs()
      .then(res => setLogs(res.data as RefundAuditLog[]))
      .catch(e => setError(e?.response?.data || 'Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Refund Audit Logs</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Refund ID</th>
            <th className="border px-2">Action</th>
            <th className="border px-2">By</th>
            <th className="border px-2">At</th>
            <th className="border px-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td className="border px-2">{log.id}</td>
              <td className="border px-2">{log.refundId}</td>
              <td className="border px-2">{log.action}</td>
              <td className="border px-2">{log.performedBy}</td>
              <td className="border px-2">{log.performedAt}</td>
              <td className="border px-2">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefundAuditLogPage;
