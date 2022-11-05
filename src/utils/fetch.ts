import axios, { AxiosPromise } from 'axios';

const _fetch = (url: any, options: any = {}) => {
  axios.defaults.withCredentials = true;
  const headers = options.headers || {};

  const requestOptions = {
    ...options,
    headers,
    url: url,
  };
  return axios(requestOptions);
};

export const fetch: Fetch = (url: any) => ({
  get: (options: any) => _fetch(url, { ...options, method: 'GET' }),
  post: (options: any) => _fetch(url, { ...options, method: 'POST' }),
});

export type Fetch = (url: any) => {
  get: (options: any) => AxiosPromise;
  post: (options: any) => AxiosPromise;
};
