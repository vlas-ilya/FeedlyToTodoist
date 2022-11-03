import axios from 'axios';

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

export const fetch = (url: any) => ({
  get: (options: any) => _fetch(url, { ...options, method: 'GET' }),
  post: (options: any) => _fetch(url, { ...options, method: 'POST' }),
});
