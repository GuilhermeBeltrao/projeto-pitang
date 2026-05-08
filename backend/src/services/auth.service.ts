import { AppError } from "../utils/errors";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { userRepository } from "../repositories/user.repository";

export const authService = {
  async login(email: string, senha: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Credenciais invalidas");
    }

    const passwordMatch = await comparePassword(senha, user.senha);

    if (!passwordMatch) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Credenciais invalidas");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil
    });

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        criadoEm: user.criadoEm,
        atualizadoEm: user.atualizadoEm
      }
    };
  }
};
