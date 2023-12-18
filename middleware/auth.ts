import * as jose from "jose";
import { Response, NextFunction } from "express";
import { IRequest } from "types";

const verifyToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1] as string;
  if (!token) {
    res.status(401).json({
      message: "No authorzation token provided",
    });
  }
  const key = process.env.JWT_SECRET as string;
  const secret = new TextEncoder().encode(key);
  try {
    const verified = await jose.jwtVerify(token, secret);
    if (verified) {
      req.user = verified.payload;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
};

export default verifyToken;
