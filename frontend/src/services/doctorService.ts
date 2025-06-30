import axios from 'axios';

export const doctorService = {
  getDoctors: () => axios.get('/api/opd/doctors').then(res => res.data.data),
};
