import api from "./api";
import type { User } from "../types";

export async function listUsers() {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function createUser(payload: {
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}) {
  const response = await api.post<User>("/users", payload);
  return response.data;
}

export async function updateUser(id: string, payload: Partial<{ nome: string; email: string; senha: string; perfil: string }>) {
  const response = await api.put<User>(`/users/${id}`, payload);
  return response.data;
}

export async function removeUser(id: string) {
  await api.delete(`/users/${id}`);
}
