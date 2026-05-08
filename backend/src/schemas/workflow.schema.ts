import { z } from "zod";

const paramsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  })
});

export const refundSendSchema = paramsSchema;
export const refundApproveSchema = paramsSchema;
export const refundPaySchema = paramsSchema;

export const refundRejectSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  }),
  body: z.object({
    justificativa: z.string().min(5, "Justificativa obrigatoria")
  })
});
