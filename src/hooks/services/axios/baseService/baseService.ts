import axios from 'axios';
import { urlsServices } from '../../../../configs/urlsConfig';

export const APISISPE = axios.create({
  baseURL: urlsServices.BACKENDWS,
});
//api de envio de arquivos
export const APIFile = axios.create({
  baseURL: urlsServices.SENDFILE,
});

APISISPE.interceptors.response.use(
  async response => response,
  error => {
    if (error.response.status === 500) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);
