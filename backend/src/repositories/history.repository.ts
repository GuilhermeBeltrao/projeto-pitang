import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const historyRepository = {
  listByRefundId: (solicitacaoId: string) =>
    prisma.historicoSolicitacao.findMany({
      where: { solicitacaoId },
      orderBy: { criadoEm: "desc" },
      include: {
        usuario: { select: { id: true, nome: true, email: true, perfil: true } }
      }
    }),
  create: (data: Prisma.HistoricoSolicitacaoCreateInput) =>
    prisma.historicoSolicitacao.create({ data })
};
