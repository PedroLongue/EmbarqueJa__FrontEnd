import { io } from 'socket.io-client';

const socket = io(
  window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api'
    : 'http://31.97.171.60:3000/api',
);

export default socket;
