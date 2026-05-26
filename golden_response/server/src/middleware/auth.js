import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) throw new AppError('Please log in to access this resource', 401, 'UNAUTHORIZED');

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User no longer exists', 401, 'UNAUTHORIZED');

  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError('You do not have permission', 403, 'FORBIDDEN');
  }
  next();
};
