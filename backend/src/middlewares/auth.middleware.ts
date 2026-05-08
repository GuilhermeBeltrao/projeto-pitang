import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "UNAUTHORIZED", "Token ausente");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "UNAUTHORIZED", "Token invalido");
  }

  const payload = verifyToken(token);
  req.user = payload;

  return next();
}
