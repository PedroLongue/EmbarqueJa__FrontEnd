import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api'
    : 'https://embarqueja.xyz/api',
});

export default api;
