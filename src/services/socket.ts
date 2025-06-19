import { io } from 'socket.io-client';

const socket = io(
  window.location.hostname.includes('localhost')
    ? 'http://localhost:3000'
    : 'http://embarqueja.xyz/',
);

export default socket;
