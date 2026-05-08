import { UserRole } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";
import { hashPassword } from "../utils/password";

const sanitize = (user: { senha?: string } & Record<string, unknown>) => {
  const { senha, ...safe } = user;
  return safe;
};

export const userService = {
  async list() {
    const users = await userRepository.list();
    return users.map((user) => sanitize(user));
  },

  async create(data: {
    nome: string;
    email: string;
    senha: string;
    perfil: UserRole;
  }) {
    const senha = await hashPassword(data.senha);
    const user = await userRepository.create({ ...data, senha });
    return sanitize(user);
  },

  async update(id: string, data: Partial<{ nome: string; email: string; senha: string; perfil: UserRole }>) {
    if (data.senha) {
      data.senha = await hashPassword(data.senha);
    }

    const user = await userRepository.update(id, data);
    return sanitize(user);
  },

  async remove(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(404, "NOT_FOUND", "Usuario nao encontrado");
    }

    await userRepository.delete(id);
  }
};
