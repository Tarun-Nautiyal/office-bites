import { sendOrderNotification } from './emailService.js';
import { emitOrderUpdate, emitRestaurantOrder, emitAdminUpdate } from '../config/socket.js';

export const notifyOrderEvent = async (order, user, event) => {
  const payload = {
    orderId: order._id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    event,
    estimatedDelivery: order.estimatedDelivery,
    receiptNumber: order.receiptNumber,
    timestamp: new Date().toISOString(),
  };

  emitOrderUpdate(order._id.toString(), payload);
  emitRestaurantOrder(order.restaurant.toString(), { order: payload, type: 'order-update' });
  emitAdminUpdate({ type: 'order-update', order: payload });

  if (user?.email) {
    await sendOrderNotification(user, order, event).catch(console.error);
  }
};
