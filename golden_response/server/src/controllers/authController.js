import crypto from 'crypto';
import validator from 'validator';
import { User } from '../models/User.js';
import { AppError, successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, sendTokenCookie } from '../utils/jwt.js';
import { sendEmail } from '../services/emailService.js';

const sendAuthResponse = (res, user, statusCode, message) => {
  const token = signToken(user._id);
  sendTokenCookie(res, token);
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    restaurantId: user.restaurantId,
  };
  return successResponse(res, { status: statusCode, message, data: { user: userData, token } });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Please provide name, email and password', 400, 'VALIDATION_ERROR');
  }
  if (!validator.isEmail(email)) {
    throw new AppError('Invalid email address', 400, 'VALIDATION_ERROR');
  }
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, 'VALIDATION_ERROR');
  }

  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 400, 'DUPLICATE_EMAIL');

  const user = await User.create({ name, email, password, phone });
  return sendAuthResponse(res, user, 201, 'Registration successful');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400, 'VALIDATION_ERROR');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return sendAuthResponse(res, user, 200, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 1000), httpOnly: true });
  return successResponse(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favoriteRestaurants', 'name image rating cuisine slug')
    .select('-password');
  return successResponse(res, { data: { user } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  ).select('-password');
  return successResponse(res, { message: 'Profile updated', data: { user } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return successResponse(res, { message: 'If that email exists, a reset link was sent' });
  }

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset - OfficeBite',
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 10 minutes.</p>`,
  });

  return successResponse(res, { message: 'If that email exists, a reset link was sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) throw new AppError('Token invalid or expired', 400, 'INVALID_TOKEN');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return sendAuthResponse(res, user, 200, 'Password reset successful');
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }
  user.addresses.push(req.body);
  await user.save();
  return successResponse(res, { message: 'Address added', data: { addresses: user.addresses } });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.restaurantId;
  const index = user.favoriteRestaurants.indexOf(id);
  if (index > -1) user.favoriteRestaurants.splice(index, 1);
  else user.favoriteRestaurants.push(id);
  await user.save();
  return successResponse(res, {
    message: index > -1 ? 'Removed from favorites' : 'Added to favorites',
    data: { favorites: user.favoriteRestaurants },
  });
});
