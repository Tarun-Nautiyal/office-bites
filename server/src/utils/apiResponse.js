export const successResponse = (res, { status = 200, message = 'Success', data = null, meta = null }) => {
  const payload = { status: 'success', message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(status).json(payload);
};

export const errorResponse = (res, {
  status = 500,
  errorCode = 'INTERNAL_ERROR',
  message = 'Something went wrong',
  details = null,
}) => {
  const payload = {
    status: 'error',
    errorCode,
    message,
  };
  if (details) payload.details = details;
  return res.status(status).json(payload);
};

export class AppError extends Error {
  constructor(message, statusCode = 400, errorCode = 'BAD_REQUEST', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
  }
}
