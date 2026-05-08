import jwt, { type SignOptions } from "jsonwebtoken";

export type TokenPayload = {
  id: string;
  email: string;
  nome: string;
  perfil: "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN";
};

const secret: jwt.Secret = process.env.JWT_SECRET ?? "changeme";
const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"];

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as TokenPayload;
}
