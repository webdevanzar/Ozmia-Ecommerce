import { Request } from 'express';
import { JwtPayload } from '../types/jwtpayLoad'; // adjust if needed

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  params: { id: string };
}
