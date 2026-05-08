import { Prisma, User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  list: () => prisma.user.findMany({ orderBy: { criadoEm: "desc" } }),
  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),
  delete: (id: string) => prisma.user.delete({ where: { id } })
};

export type UserEntity = User;
