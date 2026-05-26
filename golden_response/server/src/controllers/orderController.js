import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { Restaurant } from '../models/Restaurant.js';
import { PromoCode } from '../models/PromoCode.js';
import { AppError, successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyOrderEvent } from '../services/notificationService.js';

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'];

export const validatePromo = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const promo = await PromoCode.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!promo) throw new AppError('Invalid promo code', 400, 'INVALID_PROMO');
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    throw new AppError('Promo code expired', 400, 'EXPIRED_PROMO');
  }
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    throw new AppError('Promo code usage limit reached', 400, 'LIMIT_REACHED');
  }
  if (subtotal < promo.minOrder) {
    throw new AppError(`Minimum order $${promo.minOrder} required`, 400, 'MIN_ORDER');
  }

  let discount = promo.discountType === 'percentage'
    ? (subtotal * promo.discountValue) / 100
    : promo.discountValue;
  if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);

  return successResponse(res, {
    data: { code: promo.code, discount: Math.round(discount * 100) / 100, description: promo.description },
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress, promoCode, notes, paymentMethod = 'stripe' } = req.body;

  if (!items?.length) throw new AppError('Cart is empty', 400, 'EMPTY_CART');

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new AppError('Restaurant not found', 404, 'NOT_FOUND');

  let subtotal = 0;
  const orderItems = [];

  for (const cartItem of items) {
    const menuItem = await MenuItem.findById(cartItem.menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      throw new AppError(`${cartItem.name || 'Item'} is unavailable`, 400, 'UNAVAILABLE');
    }

    let itemPrice = menuItem.price;
    const customizations = cartItem.customizations || [];
    customizations.forEach((c) => { itemPrice += c.price || 0; });

    const lineSubtotal = itemPrice * cartItem.quantity;
    subtotal += lineSubtotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: cartItem.quantity,
      customizations,
      subtotal: lineSubtotal,
    });
  }

  let discount = 0;
  let appliedPromo = null;
  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
    if (promo && subtotal >= promo.minOrder) {
      discount = promo.discountType === 'percentage'
        ? (subtotal * promo.discountValue) / 100
        : promo.discountValue;
      if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
      appliedPromo = promo.code;
    }
  }

  const deliveryFee = restaurant.deliveryFee || 0;
  const total = Math.round((subtotal + deliveryFee - discount) * 100) / 100;

  const estimatedMinutes = restaurant.deliveryTime || 30;
  const estimatedDelivery = new Date(Date.now() + estimatedMinutes * 60 * 1000);

  const order = await Order.create({
    user: req.user._id,
    restaurant: restaurant._id,
    items: orderItems,
    deliveryAddress,
    subtotal,
    deliveryFee,
    discount,
    promoCode: appliedPromo,
    total,
    paymentMethod,
    estimatedDelivery,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
    notes,
  });

  if (appliedPromo) {
    await PromoCode.findOneAndUpdate({ code: appliedPromo }, { $inc: { usedCount: 1 } });
  }

  await notifyOrderEvent(order, req.user, 'confirmed');

  return successResponse(res, {
    status: 201,
    message: 'Order created',
    data: { order },
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .populate('restaurant', 'name image slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments({ user: req.user._id }),
  ]);
  return successResponse(res, {
    data: { orders },
    meta: { page: Number(page), total, pages: Math.ceil(total / limit) },
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image phone address')
    .populate('user', 'name email phone');

  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
  if (order.user._id.toString() !== req.user._id.toString() && !['admin', 'restaurant'].includes(req.user.role)) {
    throw new AppError('Not authorized', 403, 'FORBIDDEN');
  }

  return successResponse(res, { data: { order } });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!STATUS_FLOW.includes(status)) {
    throw new AppError('Invalid status', 400, 'INVALID_STATUS');
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');

  order.status = status;
  order.statusHistory.push({ status, note });
  if (status === 'delivered') order.paymentStatus = order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus;
  await order.save();

  await notifyOrderEvent(order, order.user, status);

  return successResponse(res, { message: 'Order status updated', data: { order } });
});

export const getRestaurantOrders = asyncHandler(async (req, res) => {
  const filter = { restaurant: req.params.restaurantId };
  if (req.query.status) filter.status = req.query.status;

  const orders = await Order.find(filter)
    .populate('user', 'name phone')
    .sort('-createdAt')
    .limit(50);

  return successResponse(res, { data: { orders } });
});
