import api from "./api";
import type { Category } from "../types";

export async function listCategories() {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(payload: { nome: string; ativo?: boolean }) {
  const response = await api.post<Category>("/categories", payload);
  return response.data;
}

export async function updateCategory(id: string, payload: Partial<{ nome: string; ativo: boolean }>) {
  const response = await api.put<Category>(`/categories/${id}`, payload);
  return response.data;
}

export async function removeCategory(id: string) {
  await api.delete(`/categories/${id}`);
}
