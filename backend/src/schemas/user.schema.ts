import { z } from "zod";

const roleSchema = z.enum(["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"]);

export const userParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  })
});

export const userCreateSchema = z.object({
  body: z.object({
    nome: z.string().min(2, "Nome obrigatorio"),
    email: z.string().email("Email invalido"),
    senha: z.string().min(6, "Senha muito curta"),
    perfil: roleSchema
  })
});

export const userUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  }),
  body: z.object({
    nome: z.string().min(2, "Nome obrigatorio").optional(),
    email: z.string().email("Email invalido").optional(),
    senha: z.string().min(6, "Senha muito curta").optional(),
    perfil: roleSchema.optional()
  })
});
