import { Prisma, Categoria } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const categoryRepository = {
  list: () => prisma.categoria.findMany({ orderBy: { criadoEm: "desc" } }),
  findById: (id: string) => prisma.categoria.findUnique({ where: { id } }),
  create: (data: Prisma.CategoriaCreateInput) => prisma.categoria.create({ data }),
  update: (id: string, data: Prisma.CategoriaUpdateInput) =>
    prisma.categoria.update({ where: { id }, data }),
  delete: (id: string) => prisma.categoria.delete({ where: { id } })
};

export type CategoryEntity = Categoria;
