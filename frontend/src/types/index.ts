export type UserRole = "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN";
export type RefundStatus = "RASCUNHO" | "ENVIADO" | "APROVADO" | "REJEITADO" | "PAGO";

export type User = {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Category = {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Attachment = {
  id?: string;
  nomeArquivo: string;
  urlArquivo: string;
  tipoArquivo: string;
  criadoEm?: string;
};

export type Refund = {
  id: string;
  solicitanteId: string;
  categoriaId: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
  status: RefundStatus;
  justificativaRejeicao?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
  categoria?: Category;
  anexos?: Attachment[];
  solicitante?: User;
};

export type Paginated<T> = {
  items: T[];
  meta: { page: number; pageSize: number; total: number };
};
