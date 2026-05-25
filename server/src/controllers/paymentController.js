import Stripe from 'stripe';
import { Order } from '../models/Order.js';
import { AppError, successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyOrderEvent } from '../services/notificationService.js';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('your_stripe')) return null;
  return new Stripe(key);
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403, 'FORBIDDEN');
  }

  const stripe = getStripe();
  if (!stripe) {
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();
    await notifyOrderEvent(order, order.user, 'payment_success');
    return successResponse(res, {
      message: 'Demo payment successful (Stripe not configured)',
      data: { order, demoMode: true },
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: order.user.email,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `OfficeBite Order ${order.receiptNumber}`,
          description: `${order.items.length} items`,
        },
        unit_amount: Math.round(order.total * 100),
      },
      quantity: 1,
    }],
    metadata: { orderId: order._id.toString() },
    success_url: `${process.env.CLIENT_URL}/orders/${order._id}/track?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/checkout?payment=cancelled&orderId=${order._id}`,
  });

  order.stripeSessionId = session.id;
  await order.save();

  return successResponse(res, {
    data: { sessionId: session.id, url: session.url },
  });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(200).send('ok');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findById(session.metadata.orderId).populate('user', 'name email');
    if (order) {
      order.paymentStatus = 'paid';
      order.paymentIntentId = session.payment_intent;
      order.status = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', note: 'Payment received' });
      await order.save();
      await notifyOrderEvent(order, order.user, 'payment_success');
    }
  }

  res.status(200).json({ received: true });
});

export const confirmDemoPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');

  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed' });
  await order.save();
  await notifyOrderEvent(order, order.user, 'payment_success');

  return successResponse(res, { message: 'Payment confirmed', data: { order } });
});
