import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return errorResponse(res, {
      status: 400,
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, {
      status: 400,
      errorCode: 'DUPLICATE_FIELD',
      message: `${field} already exists`,
    });
  }

  if (err.name === 'CastError') {
    return errorResponse(res, {
      status: 400,
      errorCode: 'INVALID_ID',
      message: 'Invalid resource ID',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, { status: 401, errorCode: 'INVALID_TOKEN', message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, { status: 401, errorCode: 'TOKEN_EXPIRED', message: 'Token expired' });
  }

  if (err.isOperational) {
    return errorResponse(res, {
      status: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    });
  }

  return errorResponse(res, {
    status: 500,
    errorCode: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
