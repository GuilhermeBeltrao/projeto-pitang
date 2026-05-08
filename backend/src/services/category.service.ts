import { categoryRepository } from "../repositories/category.repository";
import { AppError } from "../utils/errors";

export const categoryService = {
  list: () => categoryRepository.list(),

  async create(data: { nome: string; ativo?: boolean }) {
    return categoryRepository.create({ nome: data.nome, ativo: data.ativo ?? true });
  },

  async update(id: string, data: { nome?: string; ativo?: boolean }) {
    return categoryRepository.update(id, data);
  },

  async remove(id: string) {
    const categoria = await categoryRepository.findById(id);

    if (!categoria) {
      throw new AppError(404, "NOT_FOUND", "Categoria nao encontrada");
    }

    await categoryRepository.delete(id);
  }
};
