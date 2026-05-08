import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../utils/errors";

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
    }

    if (!roles.includes(req.user.perfil)) {
      throw new AppError(403, "FORBIDDEN", "Acesso negado");
    }

    return next();
  };
}
