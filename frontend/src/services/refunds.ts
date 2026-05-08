import api from "./api";
import type { Paginated, Refund } from "../types";

export type RefundQuery = {
  page?: number;
  pageSize?: number;
  status?: string;
};

function buildQuery(params?: RefundQuery) {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.page) search.append("page", String(params.page));
  if (params.pageSize) search.append("pageSize", String(params.pageSize));
  if (params.status) search.append("status", params.status);
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function listRefunds(params?: RefundQuery) {
  const response = await api.get<Paginated<Refund>>(`/refunds${buildQuery(params)}`);
  return response.data;
}

export async function getRefund(id: string) {
  const response = await api.get<Refund>(`/refunds/${id}`);
  return response.data;
}

export async function createRefund(payload: {
  categoriaId: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
  anexos?: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }[];
}) {
  const response = await api.post<Refund>("/refunds", payload);
  return response.data;
}

export async function updateRefund(id: string, payload: Partial<{
  categoriaId: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
  anexos?: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }[];
}>) {
  const response = await api.put<Refund>(`/refunds/${id}`, payload);
  return response.data;
}

export async function removeRefund(id: string) {
  await api.delete(`/refunds/${id}`);
}

export async function sendRefund(id: string) {
  const response = await api.patch<Refund>(`/refunds/${id}/send`);
  return response.data;
}

export async function approveRefund(id: string) {
  const response = await api.patch<Refund>(`/refunds/${id}/approve`);
  return response.data;
}

export async function rejectRefund(id: string, justificativa: string) {
  const response = await api.patch<Refund>(`/refunds/${id}/reject`, { justificativa });
  return response.data;
}

export async function payRefund(id: string) {
  const response = await api.patch<Refund>(`/refunds/${id}/pay`);
  return response.data;
}

export async function listRefundHistory(id: string) {
  const response = await api.get(`/refunds/${id}/history`);
  return response.data;
}

export async function purgeRefunds() {
  const response = await api.delete<{ deleted: { refunds: number; attachments: number; history: number } }>(
    "/refunds/purge"
  );
  return response.data;
}
