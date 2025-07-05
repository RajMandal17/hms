import { apiService } from './api';
import { AxiosResponse } from 'axios';

export interface IPDBed {
  id: number;
  wardId: number;
  bedNumber: string;
  status: string;
}

export const ipdService = {
  admitPatient: (data: any) => apiService.post('/ipd/admissions', data).then((res: AxiosResponse<any>) => res.data),
  getWards: () => apiService.get('/ipd/wards').then((res: AxiosResponse<any>) => res.data),
  getBedsByWard: (wardId: string) => apiService.get<any>('/ipd/beds').then((res: AxiosResponse<any>) =>
    (res.data as IPDBed[]).filter((b: IPDBed) => b.wardId === Number(wardId))
  ),
  getAdmissions: () => apiService.get('/ipd/admissions').then((res: AxiosResponse<any>) => {
    // Ensure always returns an array, even if backend returns object with numeric keys
    const data = res.data;
    if (Array.isArray(data)) return data;
    return Object.values(data);
  }),
  addWard: (data: any) => apiService.post('/ipd/wards', data).then((res: AxiosResponse<any>) => res.data),
  getAvailableBedsByWard: (wardId: string | number) =>
    apiService.get(`/ipd/beds/available`, { wardId }).then((res: AxiosResponse<any>) => res.data),

  // Bed CRUD
  addBed: (data: any) => apiService.post('/ipd/beds', data).then((res: AxiosResponse<any>) => res.data),
  updateBed: (id: number, data: any) => apiService.put(`/ipd/beds/${id}`, data).then((res: AxiosResponse<any>) => res.data),
  deleteBed: (id: number) => apiService.delete(`/ipd/beds/${id}`).then((res: AxiosResponse<any>) => res.data),
  updateBedStatus: (id: number, status: string) => apiService.put(`/ipd/beds/${id}/status?status=${encodeURIComponent(status)}`).then((res: AxiosResponse<any>) => res.data),
};
