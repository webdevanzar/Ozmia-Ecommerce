import { JwtPayload } from '../jwtpayLoad'; 

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

