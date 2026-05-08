import request from "supertest";
import { UserRole } from "@prisma/client";
import app from "../app";
import { prisma } from "../utils/prisma";
import { hashPassword } from "../utils/password";

export const defaultPassword = "Passw0rd!";

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "HistoricoSolicitacao", "Anexo", "SolicitacaoReembolso", "Categoria", "User" RESTART IDENTITY CASCADE'
  );
}

export async function seedBaseData() {
  const senha = await hashPassword(defaultPassword);

  await prisma.user.createMany({
    data: [
      {
        nome: "Colaborador",
        email: "colaborador@test.local",
        senha,
        perfil: UserRole.COLABORADOR
      },
      {
        nome: "Gestor",
        email: "gestor@test.local",
        senha,
        perfil: UserRole.GESTOR
      },
      {
        nome: "Financeiro",
        email: "financeiro@test.local",
        senha,
        perfil: UserRole.FINANCEIRO
      },
      {
        nome: "Admin",
        email: "admin@test.local",
        senha,
        perfil: UserRole.ADMIN
      }
    ]
  });

  await prisma.categoria.createMany({
    data: [
      { nome: "Transporte", ativo: true },
      { nome: "Alimentacao", ativo: true }
    ]
  });
}

export async function loginAs(role: UserRole) {
  const emailMap: Record<UserRole, string> = {
    [UserRole.COLABORADOR]: "colaborador@test.local",
    [UserRole.GESTOR]: "gestor@test.local",
    [UserRole.FINANCEIRO]: "financeiro@test.local",
    [UserRole.ADMIN]: "admin@test.local"
  };

  const response = await request(app).post("/auth/login").send({
    email: emailMap[role],
    senha: defaultPassword
  });

  return response.body.token as string;
}

export async function getFirstCategoryId() {
  const category = await prisma.categoria.findFirst({ orderBy: { criadoEm: "asc" } });
  return category?.id as string;
}

export { app, request };
