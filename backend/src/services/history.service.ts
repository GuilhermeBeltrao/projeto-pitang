import { HistoryAction } from "@prisma/client";
import { historyRepository } from "../repositories/history.repository";

export const historyService = {
  listByRefundId: (solicitacaoId: string) =>
    historyRepository.listByRefundId(solicitacaoId),

  log: (params: {
    solicitacaoId: string;
    usuarioId: string;
    acao: HistoryAction;
    observacao?: string | null;
  }) =>
    historyRepository.create({
      solicitacao: { connect: { id: params.solicitacaoId } },
      usuario: { connect: { id: params.usuarioId } },
      acao: params.acao,
      observacao: params.observacao ?? undefined
    })
};
