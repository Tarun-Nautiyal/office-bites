import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: true, transports: ['websocket', 'polling'] });
  }
  return socket;
};

export const joinOrderRoom = (orderId: string) => {
  getSocket().emit('join-order', orderId);
};

export const joinAdminRoom = () => {
  getSocket().emit('join-admin');
};
