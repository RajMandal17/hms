import { apiService as api } from '../services/api';

export interface RefundAuditLog {
  id: number;
  refundId: number;
  action: string;
  performedBy: string;
  performedAt: string;
  details: string;
}

export const getAllRefundAuditLogs = () =>
  api.get<RefundAuditLog[]>('/billing/refund-audit');
