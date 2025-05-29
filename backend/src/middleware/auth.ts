import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';  // dotenv
dotenv.config();

 const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
     res.status(401).json({ error: 'No token provided' });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };
    
    // TypeScript will now recognize req.user
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export {authenticateToken}