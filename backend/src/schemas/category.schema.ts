import { z } from "zod";

export const categoryParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  })
});

export const categoryCreateSchema = z.object({
  body: z.object({
    nome: z.string().min(2, "Nome obrigatorio"),
    ativo: z.boolean().optional()
  })
});

export const categoryUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  }),
  body: z.object({
    nome: z.string().min(2, "Nome obrigatorio").optional(),
    ativo: z.boolean().optional()
  })
});
