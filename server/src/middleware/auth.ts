import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};