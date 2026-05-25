import { MenuItem } from '../models/MenuItem.js';
import { Restaurant } from '../models/Restaurant.js';
import { AppError, successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant || req.params.restaurantId);
  if (!restaurant) throw new AppError('Restaurant not found', 404, 'NOT_FOUND');

  const item = await MenuItem.create({ ...req.body, restaurant: restaurant._id });
  return successResponse(res, { status: 201, message: 'Menu item created', data: { item } });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) throw new AppError('Menu item not found', 404, 'NOT_FOUND');
  return successResponse(res, { message: 'Menu item updated', data: { item } });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndUpdate(req.params.id, { isAvailable: false });
  return successResponse(res, { message: 'Menu item removed' });
});

export const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.restaurantId });
  return successResponse(res, { data: { items } });
});
