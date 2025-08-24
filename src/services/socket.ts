import { io } from 'socket.io-client';

let socket: any = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      window.location.hostname.includes('localhost')
        ? 'http://localhost:3000'
        : 'https://embarqueja.xyz/',
      {
        transports: ['websocket'],
        upgrade: false,
        rememberUpgrade: true,
        autoConnect: false,
      },
    );
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
