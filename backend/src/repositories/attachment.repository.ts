import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const attachmentRepository = {
  deleteByRefundId: (solicitacaoId: string) =>
    prisma.anexo.deleteMany({ where: { solicitacaoId } }),
  createMany: (data: Prisma.AnexoCreateManyInput[]) =>
    prisma.anexo.createMany({ data })
};
