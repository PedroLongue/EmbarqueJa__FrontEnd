import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api'
    : 'http://31.97.171.60:3000/api',
});

export default api;
