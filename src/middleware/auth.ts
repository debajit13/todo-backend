import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.header('Authorization');
  token = token && token.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({
      error: true,
      message: 'token is required!',
    });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET || 'TodoBackend');
    if ('user' in req) {
      req['user'] = decode;
    }
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Invalid token',
    });
  }

  return next();
};

export default auth;
