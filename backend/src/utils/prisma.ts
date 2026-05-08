import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL;

export const prisma = new PrismaClient({
  datasourceUrl: databaseUrl
});
