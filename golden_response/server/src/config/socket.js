import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-order', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('join-restaurant', (restaurantId) => {
      socket.join(`restaurant:${restaurantId}`);
    });

    socket.on('join-admin', () => {
      socket.join('admin-dashboard');
    });
  });

  return io;
};

export const getIO = () => io;

export const emitOrderUpdate = (orderId, payload) => {
  if (io) io.to(`order:${orderId}`).emit('order-update', payload);
};

export const emitRestaurantOrder = (restaurantId, payload) => {
  if (io) io.to(`restaurant:${restaurantId}`).emit('new-order', payload);
};

export const emitAdminUpdate = (payload) => {
  if (io) io.to('admin-dashboard').emit('admin-update', payload);
};
