import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err) {
    const statusCode = err.statusCode || 400;
    res
      .status(statusCode)
      .json({ message: err.message || "Something went wrong" });
    return;
  }

  next();
};
