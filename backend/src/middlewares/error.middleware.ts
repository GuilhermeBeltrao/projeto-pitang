import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      issues: error.issues
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados invalidos",
      code: "VALIDATION_ERROR",
      issues: error.issues
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Registro duplicado",
        code: "DUPLICATE_RECORD"
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Registro nao encontrado",
        code: "NOT_FOUND"
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    message: "Erro interno no servidor",
    code: "INTERNAL_ERROR"
  });
}
