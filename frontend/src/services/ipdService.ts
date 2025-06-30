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
  getAdmissions: () => apiService.get('/ipd/admissions').then((res: AxiosResponse<any>) => res.data),
  addWard: (data: any) => apiService.post('/ipd/wards', data).then((res: AxiosResponse<any>) => res.data),
  getAvailableBedsByWard: (wardId: string | number) =>
    apiService.get(`/ipd/beds/available`, { wardId }).then((res: AxiosResponse<any>) => res.data),
};
