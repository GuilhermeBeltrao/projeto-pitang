import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalido"),
    senha: z.string().min(6, "Senha muito curta")
  })
});
