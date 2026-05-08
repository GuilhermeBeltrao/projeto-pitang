import api from "./api";
import type { User } from "../types";

export async function login(email: string, senha: string) {
  const response = await api.post<{ token: string; user: User }>("/auth/login", {
    email,
    senha
  });

  return response.data;
}
