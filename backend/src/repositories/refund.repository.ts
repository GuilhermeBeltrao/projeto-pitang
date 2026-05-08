import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const refundRepository = {
  list: (args: Prisma.SolicitacaoReembolsoFindManyArgs) =>
    prisma.solicitacaoReembolso.findMany(args),
  count: (args: Prisma.SolicitacaoReembolsoCountArgs) =>
    prisma.solicitacaoReembolso.count(args),
  findById: (id: string) =>
    prisma.solicitacaoReembolso.findUnique({
      where: { id },
      include: {
        categoria: true,
        anexos: true,
        solicitante: {
          select: { id: true, nome: true, email: true, perfil: true }
        }
      }
    }),
  create: (data: Prisma.SolicitacaoReembolsoCreateInput) =>
    prisma.solicitacaoReembolso.create({
      data,
      include: { categoria: true, anexos: true }
    }),
  update: (id: string, data: Prisma.SolicitacaoReembolsoUpdateInput) =>
    prisma.solicitacaoReembolso.update({
      where: { id },
      data,
      include: { categoria: true, anexos: true }
    }),
  delete: (id: string) =>
    prisma.solicitacaoReembolso.delete({ where: { id } })
};
