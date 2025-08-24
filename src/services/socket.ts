import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://embarqueja.xyz/';

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const { io } = await import('socket.io-client');
    socket = io(BASE_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
}

export async function connectSocket(): Promise<Socket> {
  const s = await getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
