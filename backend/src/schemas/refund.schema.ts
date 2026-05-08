import dayjs from "dayjs";
import { z } from "zod";

const statusSchema = z.enum(["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "PAGO"]);

const attachmentSchema = z.object({
  nomeArquivo: z.string().min(2, "Nome do arquivo obrigatorio"),
  urlArquivo: z.string().min(3, "URL obrigatoria"),
  tipoArquivo: z.string().min(2, "Tipo obrigatorio")
});

const dateSchema = z
  .string()
  .refine((value) => dayjs(value).isValid(), "Data invalida");

export const refundParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  })
});

export const refundQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
    status: statusSchema.optional(),
    categoriaId: z.string().uuid().optional(),
    solicitanteId: z.string().uuid().optional()
  })
});

export const refundCreateSchema = z.object({
  body: z.object({
    categoriaId: z.string().uuid("Categoria invalida"),
    descricao: z.string().min(5, "Descricao obrigatoria"),
    valor: z.coerce.number().positive("Valor deve ser positivo"),
    dataDespesa: dateSchema,
    anexos: z.array(attachmentSchema).optional()
  })
});

export const refundUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id invalido")
  }),
  body: z.object({
    categoriaId: z.string().uuid("Categoria invalida").optional(),
    descricao: z.string().min(5, "Descricao obrigatoria").optional(),
    valor: z.coerce.number().positive("Valor deve ser positivo").optional(),
    dataDespesa: dateSchema.optional(),
    anexos: z.array(attachmentSchema).optional()
  })
});

export const refundPurgeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
