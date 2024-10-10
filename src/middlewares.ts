import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "./types/error-response-type";
import jwt from 'jsonwebtoken';
import User from "./models/User";


export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const verify = async () => {
    const decoded: any = jwt.verify(token, 'secret');
    const id = decoded.id;

    const user = await User.findByPk(id);


    if (!user) {
      return res.status(404).json('User must be logged in')
    }
  }

  verify();

  next();
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  _err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: "Internal Server Error" });
  // res.status(statusCode).json({
  //   message: err.message,
  //   stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  // });
}
