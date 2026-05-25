import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { Review } from '../models/Review.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    totalRevenue,
    todayRevenue,
    totalUsers,
    totalRestaurants,
    activeOrders,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    User.countDocuments({ role: 'user' }),
    Restaurant.countDocuments({ isActive: true }),
    Order.countDocuments({ status: { $nin: ['delivered', 'cancelled'] } }),
    Order.find().populate('user', 'name').populate('restaurant', 'name').sort('-createdAt').limit(10),
  ]);

  const statusBreakdown = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const revenueByDay = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return successResponse(res, {
    data: {
      stats: {
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalUsers,
        totalRestaurants,
        activeOrders,
      },
      statusBreakdown,
      revenueByDay,
      recentOrders,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(Number(limit)).sort('-createdAt'),
    User.countDocuments(filter),
  ]);

  return successResponse(res, { data: { users }, meta: { total, page: Number(page) } });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  let orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('restaurant', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  if (search) {
    const s = search.toLowerCase();
    orders = orders.filter(
      (o) => o.receiptNumber?.toLowerCase().includes(s)
        || o.user?.name?.toLowerCase().includes(s)
        || o.restaurant?.name?.toLowerCase().includes(s)
    );
  }

  const total = await Order.countDocuments(filter);
  return successResponse(res, { data: { orders }, meta: { total, page: Number(page) } });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    user: req.user._id,
    userName: req.user.name,
  });

  const stats = await Review.aggregate([
    { $match: { restaurant: review.restaurant } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats[0]) {
    await Restaurant.findByIdAndUpdate(review.restaurant, {
      rating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    });
  }

  return successResponse(res, { status: 201, message: 'Review submitted', data: { review } });
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.restaurantId })
    .sort('-createdAt')
    .limit(20);
  return successResponse(res, { data: { reviews } });
});
