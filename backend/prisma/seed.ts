import { HistoryAction, Prisma, PrismaClient, RefundStatus, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);

  await prisma.user.createMany({
    data: [
      {
        nome: "Ana Colaboradora",
        email: "colaborador@demo.local",
        senha: passwordHash,
        perfil: UserRole.COLABORADOR
      },
      {
        nome: "Gustavo Gestor",
        email: "gestor@demo.local",
        senha: passwordHash,
        perfil: UserRole.GESTOR
      },
      {
        nome: "Fernanda Financeiro",
        email: "financeiro@demo.local",
        senha: passwordHash,
        perfil: UserRole.FINANCEIRO
      },
      {
        nome: "Alice Admin",
        email: "admin@demo.local",
        senha: passwordHash,
        perfil: UserRole.ADMIN
      }
    ],
    skipDuplicates: true
  });

  const existingCategories = await prisma.categoria.count();
  if (existingCategories === 0) {
    await prisma.categoria.createMany({
      data: [
        { nome: "Transporte", ativo: true },
        { nome: "Alimentacao", ativo: true },
        { nome: "Hospedagem", ativo: true },
        { nome: "Outros", ativo: true }
      ]
    });
  }

  const existingRefunds = await prisma.solicitacaoReembolso.count();
  if (existingRefunds > 0) {
    return;
  }

  const [colaborador, gestor, financeiro] = await prisma.user.findMany({
    where: {
      email: {
        in: ["colaborador@demo.local", "gestor@demo.local", "financeiro@demo.local"]
      }
    }
  });

  const [transporte, alimentacao, hospedagem] = await prisma.categoria.findMany({
    orderBy: { criadoEm: "asc" }
  });

  if (!colaborador || !gestor || !financeiro || !transporte || !alimentacao || !hospedagem) {
    return;
  }

  const createRefundWithHistory = async (params: {
    descricao: string;
    valor: number;
    categoriaId: string;
    status: RefundStatus;
    justificativaRejeicao?: string;
    dataDespesa: Date;
  }) => {
    const refund = await prisma.solicitacaoReembolso.create({
      data: {
        solicitanteId: colaborador.id,
        categoriaId: params.categoriaId,
        descricao: params.descricao,
        valor: new Prisma.Decimal(params.valor),
        dataDespesa: params.dataDespesa,
        status: params.status,
        justificativaRejeicao: params.justificativaRejeicao
      }
    });

    const history: Prisma.HistoricoSolicitacaoCreateManyInput[] = [
      {
        solicitacaoId: refund.id,
        usuarioId: colaborador.id,
        acao: HistoryAction.CRIAR,
        observacao: "Solicitacao criada"
      }
    ];

    if (params.status !== RefundStatus.RASCUNHO) {
      history.push({
        solicitacaoId: refund.id,
        usuarioId: colaborador.id,
        acao: HistoryAction.ENVIAR,
        observacao: "Solicitacao enviada"
      });
    }

    if (params.status === RefundStatus.APROVADO || params.status === RefundStatus.PAGO) {
      history.push({
        solicitacaoId: refund.id,
        usuarioId: gestor.id,
        acao: HistoryAction.APROVAR,
        observacao: "Solicitacao aprovada"
      });
    }

    if (params.status === RefundStatus.REJEITADO) {
      history.push({
        solicitacaoId: refund.id,
        usuarioId: gestor.id,
        acao: HistoryAction.REJEITAR,
        observacao: params.justificativaRejeicao ?? "Despesa nao elegivel"
      });
    }

    if (params.status === RefundStatus.PAGO) {
      history.push({
        solicitacaoId: refund.id,
        usuarioId: financeiro.id,
        acao: HistoryAction.PAGAR,
        observacao: "Pagamento realizado"
      });
    }

    await prisma.historicoSolicitacao.createMany({ data: history });

    if (params.status === RefundStatus.PAGO) {
      await prisma.anexo.create({
        data: {
          solicitacaoId: refund.id,
          nomeArquivo: "comprovante.pdf",
          urlArquivo: "https://example.com/comprovante.pdf",
          tipoArquivo: "application/pdf"
        }
      });
    }
  };

  const today = new Date();
  await createRefundWithHistory({
    descricao: "Taxi aeroporto",
    valor: 120.5,
    categoriaId: transporte.id,
    status: RefundStatus.RASCUNHO,
    dataDespesa: today
  });

  await createRefundWithHistory({
    descricao: "Almoco com cliente",
    valor: 85,
    categoriaId: alimentacao.id,
    status: RefundStatus.ENVIADO,
    dataDespesa: today
  });

  await createRefundWithHistory({
    descricao: "Hospedagem viagem SP",
    valor: 680,
    categoriaId: hospedagem.id,
    status: RefundStatus.APROVADO,
    dataDespesa: today
  });

  await createRefundWithHistory({
    descricao: "Upgrade de quarto",
    valor: 190,
    categoriaId: hospedagem.id,
    status: RefundStatus.REJEITADO,
    justificativaRejeicao: "Despesa fora da politica",
    dataDespesa: today
  });

  await createRefundWithHistory({
    descricao: "Translado interno",
    valor: 60,
    categoriaId: transporte.id,
    status: RefundStatus.PAGO,
    dataDespesa: today
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
