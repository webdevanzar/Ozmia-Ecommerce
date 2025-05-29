import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';  // dotenv
dotenv.config();

const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token){
    res.status(401).json({ message: 'Access token required' });
   return;  
}
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET as string) as { id: string, email: string, role: string };
    
    if (decoded.role !== 'admin') {
       res.status(403).json({ message: 'Access denied: Admins only' });
       return;
      }
    
    (req as any).admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export {authenticateAdmin}