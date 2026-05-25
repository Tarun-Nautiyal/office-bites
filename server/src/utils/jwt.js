import jwt from 'jsonwebtoken';

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const sendTokenCookie = (res, token) => {
  const days = Number(process.env.JWT_COOKIE_EXPIRE) || 7;
  const options = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('token', token, options);
};
