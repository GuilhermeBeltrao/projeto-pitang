import { HistoryAction, RefundStatus, UserRole } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { categoryRepository } from "../repositories/category.repository";
import { refundRepository } from "../repositories/refund.repository";
import { historyService } from "./history.service";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/errors";
import { REFUND_EDITABLE_STATUSES, REFUND_SEND_STATUSES } from "../utils/constants";

const refundInclude = {
  categoria: true,
  anexos: true,
  solicitante: {
    select: { id: true, nome: true, email: true, perfil: true }
  }
};

function ensureAccess(user: Express.Request["user"], refund: { solicitanteId: string; status: RefundStatus }) {
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
  }

  if (user.perfil === UserRole.COLABORADOR && refund.solicitanteId !== user.id) {
    throw new AppError(403, "FORBIDDEN", "Acesso negado");
  }

  if (user.perfil === UserRole.GESTOR && refund.status !== RefundStatus.ENVIADO) {
    throw new AppError(403, "FORBIDDEN", "Acesso negado");
  }

  if (user.perfil === UserRole.FINANCEIRO && refund.status !== RefundStatus.APROVADO) {
    throw new AppError(403, "FORBIDDEN", "Acesso negado");
  }
}

export const refundService = {
  async list(user: Express.Request["user"], query: {
    page?: number;
    pageSize?: number;
    status?: RefundStatus;
    categoriaId?: string;
    solicitanteId?: string;
  }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const where: Prisma.SolicitacaoReembolsoWhereInput = {
      categoriaId: query.categoriaId,
      status: query.status
    };

    if (user.perfil === UserRole.COLABORADOR) {
      where.solicitanteId = user.id;
    }

    if (user.perfil === UserRole.GESTOR) {
      where.status = RefundStatus.ENVIADO;
    }

    if (user.perfil === UserRole.FINANCEIRO) {
      where.status = RefundStatus.APROVADO;
    }

    if (user.perfil === UserRole.ADMIN && query.solicitanteId) {
      where.solicitanteId = query.solicitanteId;
    }

    const [items, total] = await prisma.$transaction([
      refundRepository.list({
        where,
        include: refundInclude,
        orderBy: { criadoEm: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      refundRepository.count({ where })
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        total
      }
    };
  },

  async getById(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    ensureAccess(user, refund);
    return refund;
  },

  async create(data: {
    solicitanteId: string;
    categoriaId: string;
    descricao: string;
    valor: number;
    dataDespesa: string;
    anexos?: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }[];
  }) {
    const categoria = await categoryRepository.findById(data.categoriaId);

    if (!categoria || !categoria.ativo) {
      throw new AppError(400, "INVALID_CATEGORY", "Categoria invalida");
    }

    const anexos = data.anexos ?? [];

    const refund = await prisma.$transaction(async (tx) => {
      const created = await tx.solicitacaoReembolso.create({
        data: {
          solicitante: { connect: { id: data.solicitanteId } },
          categoria: { connect: { id: data.categoriaId } },
          descricao: data.descricao,
          valor: new Prisma.Decimal(data.valor),
          dataDespesa: new Date(data.dataDespesa),
          status: RefundStatus.RASCUNHO
        },
        include: refundInclude
      });

      if (anexos.length) {
        await tx.anexo.createMany({
          data: anexos.map((anexo) => ({
            solicitacaoId: created.id,
            nomeArquivo: anexo.nomeArquivo,
            urlArquivo: anexo.urlArquivo,
            tipoArquivo: anexo.tipoArquivo
          }))
        });
      }

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id: created.id } },
          usuario: { connect: { id: data.solicitanteId } },
          acao: HistoryAction.CRIAR,
          observacao: "Solicitacao criada"
        }
      });

      return created;
    });

    return refund;
  },

  async update(
    id: string,
    user: Express.Request["user"],
    data: {
      categoriaId?: string;
      descricao?: string;
      valor?: number;
      dataDespesa?: string;
      anexos?: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }[];
    }
  ) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (!user || refund.solicitanteId !== user.id) {
      throw new AppError(403, "FORBIDDEN", "Acesso negado");
    }

    if (!REFUND_EDITABLE_STATUSES.includes(refund.status)) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser alterada");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.solicitacaoReembolso.update({
        where: { id },
        data: {
          categoriaId: data.categoriaId,
          descricao: data.descricao,
          valor: data.valor ? new Prisma.Decimal(data.valor) : undefined,
          dataDespesa: data.dataDespesa ? new Date(data.dataDespesa) : undefined
        },
        include: refundInclude
      });

      if (data.anexos) {
        await tx.anexo.deleteMany({ where: { solicitacaoId: id } });

        if (data.anexos.length) {
          await tx.anexo.createMany({
            data: data.anexos.map((anexo) => ({
              solicitacaoId: id,
              nomeArquivo: anexo.nomeArquivo,
              urlArquivo: anexo.urlArquivo,
              tipoArquivo: anexo.tipoArquivo
            }))
          });
        }
      }

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.ATUALIZAR,
          observacao: "Solicitacao atualizada"
        }
      });

      return updatedRefund;
    });

    return updated;
  },

  async remove(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (!user || refund.solicitanteId !== user.id) {
      throw new AppError(403, "FORBIDDEN", "Acesso negado");
    }

    if (!REFUND_EDITABLE_STATUSES.includes(refund.status)) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser removida");
    }

    await prisma.$transaction(async (tx) => {
      await tx.anexo.deleteMany({ where: { solicitacaoId: id } });
      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.EXCLUIR,
          observacao: "Solicitacao removida"
        }
      });
      await tx.solicitacaoReembolso.delete({ where: { id } });
    });
  },

  async send(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (!user || refund.solicitanteId !== user.id) {
      throw new AppError(403, "FORBIDDEN", "Acesso negado");
    }

    if (!REFUND_SEND_STATUSES.includes(refund.status)) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser enviada");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.solicitacaoReembolso.update({
        where: { id },
        data: {
          status: RefundStatus.ENVIADO,
          justificativaRejeicao: null
        },
        include: refundInclude
      });

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.ENVIAR,
          observacao: "Solicitacao enviada"
        }
      });

      return updatedRefund;
    });

    return updated;
  },

  async approve(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (refund.status !== RefundStatus.ENVIADO) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser aprovada");
    }

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.solicitacaoReembolso.update({
        where: { id },
        data: { status: RefundStatus.APROVADO },
        include: refundInclude
      });

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.APROVAR,
          observacao: "Solicitacao aprovada"
        }
      });

      return updatedRefund;
    });

    return updated;
  },

  async reject(id: string, user: Express.Request["user"], justificativa: string) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (refund.status !== RefundStatus.ENVIADO) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser rejeitada");
    }

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.solicitacaoReembolso.update({
        where: { id },
        data: {
          status: RefundStatus.REJEITADO,
          justificativaRejeicao: justificativa
        },
        include: refundInclude
      });

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.REJEITAR,
          observacao: justificativa
        }
      });

      return updatedRefund;
    });

    return updated;
  },

  async pay(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    if (refund.status !== RefundStatus.APROVADO) {
      throw new AppError(400, "INVALID_STATUS", "Solicitacao nao pode ser paga");
    }

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Autenticacao necessaria");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.solicitacaoReembolso.update({
        where: { id },
        data: { status: RefundStatus.PAGO },
        include: refundInclude
      });

      await tx.historicoSolicitacao.create({
        data: {
          solicitacao: { connect: { id } },
          usuario: { connect: { id: user.id } },
          acao: HistoryAction.PAGAR,
          observacao: "Solicitacao paga"
        }
      });

      return updatedRefund;
    });

    return updated;
  },

  async purgeAll() {
    const [history, attachments, refunds] = await prisma.$transaction([
      prisma.historicoSolicitacao.deleteMany(),
      prisma.anexo.deleteMany(),
      prisma.solicitacaoReembolso.deleteMany()
    ]);

    return {
      history: history.count,
      attachments: attachments.count,
      refunds: refunds.count
    };
  },

  async history(id: string, user: Express.Request["user"]) {
    const refund = await refundRepository.findById(id);

    if (!refund) {
      throw new AppError(404, "NOT_FOUND", "Solicitacao nao encontrada");
    }

    ensureAccess(user, refund);

    return historyService.listByRefundId(id);
  }
};
