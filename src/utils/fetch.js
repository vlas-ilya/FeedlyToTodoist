const axios = require('axios');

const _fetch = (url, options = {}) => {
  axios.defaults.withCredentials = true;
  const headers = options.headers || {};

  const requestOptions = {
    ...options,
    headers,
    url: url,
  };
  return axios(requestOptions);
};

const fetch = (url) => ({
  get: (options) => _fetch(url, { ...options, method: 'GET' }),
  post: (options) => _fetch(url, { ...options, method: 'POST' }),
});

module.exports = fetch
