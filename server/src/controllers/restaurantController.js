import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { Review } from '../models/Review.js';
import { AppError, successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getRestaurants = asyncHandler(async (req, res) => {
  const {
    search, cuisine, minRating, maxDeliveryTime,
    page = 1, limit = 12, featured, sort = '-rating',
  } = req.query;

  const filter = { isActive: true };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisine: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }
  if (cuisine) filter.cuisine = { $in: cuisine.split(',') };
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (maxDeliveryTime) filter.deliveryTime = { $lte: Number(maxDeliveryTime) };
  if (featured === 'true') filter.isFeatured = true;

  const skip = (Number(page) - 1) * Number(limit);
  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Restaurant.countDocuments(filter),
  ]);

  return successResponse(res, {
    data: { restaurants },
    meta: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

export const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    isActive: true,
  });
  if (!restaurant) throw new AppError('Restaurant not found', 404, 'NOT_FOUND');

  const [menuItems, reviews] = await Promise.all([
    MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).sort('category name'),
    Review.find({ restaurant: restaurant._id }).sort('-createdAt').limit(10).populate('user', 'name avatar'),
  ]);

  const categories = [...new Set(menuItems.map((m) => m.category))];

  return successResponse(res, {
    data: { restaurant, menuItems, categories, reviews },
  });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isFeatured: true, isActive: true }).limit(8);
  return successResponse(res, { data: { restaurants } });
});

export const getPopularDishes = asyncHandler(async (req, res) => {
  const dishes = await MenuItem.find({ isPopular: true, isAvailable: true })
    .populate('restaurant', 'name slug image')
    .limit(12);
  return successResponse(res, { data: { dishes } });
});

export const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  return successResponse(res, { status: 201, message: 'Restaurant created', data: { restaurant } });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!restaurant) throw new AppError('Restaurant not found', 404, 'NOT_FOUND');
  return successResponse(res, { message: 'Restaurant updated', data: { restaurant } });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false });
  return successResponse(res, { message: 'Restaurant deactivated' });
});
