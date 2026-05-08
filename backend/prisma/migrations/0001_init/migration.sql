-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COLABORADOR', 'GESTOR', 'FINANCEIRO', 'ADMIN');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'REJEITADO', 'PAGO');

-- CreateEnum
CREATE TYPE "HistoryAction" AS ENUM ('CRIAR', 'ATUALIZAR', 'ENVIAR', 'APROVAR', 'REJEITAR', 'PAGAR', 'EXCLUIR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "UserRole" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitacaoReembolso" (
    "id" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataDespesa" TIMESTAMP(3) NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'RASCUNHO',
    "justificativaRejeicao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitacaoReembolso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "urlArquivo" TEXT NOT NULL,
    "tipoArquivo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoSolicitacao" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "acao" "HistoryAction" NOT NULL,
    "observacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoSolicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SolicitacaoReembolso_solicitanteId_idx" ON "SolicitacaoReembolso"("solicitanteId");

-- CreateIndex
CREATE INDEX "SolicitacaoReembolso_categoriaId_idx" ON "SolicitacaoReembolso"("categoriaId");

-- CreateIndex
CREATE INDEX "SolicitacaoReembolso_status_idx" ON "SolicitacaoReembolso"("status");

-- CreateIndex
CREATE INDEX "Anexo_solicitacaoId_idx" ON "Anexo"("solicitacaoId");

-- CreateIndex
CREATE INDEX "HistoricoSolicitacao_solicitacaoId_idx" ON "HistoricoSolicitacao"("solicitacaoId");

-- CreateIndex
CREATE INDEX "HistoricoSolicitacao_usuarioId_idx" ON "HistoricoSolicitacao"("usuarioId");

-- AddForeignKey
ALTER TABLE "SolicitacaoReembolso" ADD CONSTRAINT "SolicitacaoReembolso_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitacaoReembolso" ADD CONSTRAINT "SolicitacaoReembolso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "SolicitacaoReembolso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSolicitacao" ADD CONSTRAINT "HistoricoSolicitacao_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "SolicitacaoReembolso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoSolicitacao" ADD CONSTRAINT "HistoricoSolicitacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
