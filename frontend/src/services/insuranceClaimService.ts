import { apiService } from './api';

export const getClaimsByPatient = (patientId: number) => apiService.get(`/insurance/claims?patientId=${patientId}`);
export const getClaim = (claimId: number) => apiService.get(`/insurance/claims/${claimId}`);
export const submitClaim = (claim: any) => apiService.post('/insurance/claims', claim);
export const updateClaimStatus = (claimId: number, status: string, remarks: string) => apiService.patch(`/insurance/claims/${claimId}/status?status=${status}&remarks=${remarks}`);
export const uploadClaimDocument = (claimId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiService.post(`/insurance/claims/${claimId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const getClaimDocuments = (claimId: number) => apiService.get(`/insurance/claims/${claimId}/documents`);
