import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '../../../redux/store/stote';

export const configHttpRequest = (axios: AxiosInstance) => {
  const token = store.getState().auth.access_token;
  console.log({token});
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (config.headers) config.headers['Accept-Language'] = 'vi-vn';
    if (config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use(function (response: AxiosResponse) {
    return response;
  });
};