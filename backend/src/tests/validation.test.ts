import { UserRole } from "@prisma/client";
import { prisma } from "../utils/prisma";
import {
  app,
  request,
  resetDatabase,
  seedBaseData,
  loginAs,
  getFirstCategoryId
} from "./testUtils";

beforeAll(async () => {
  await resetDatabase();
  await seedBaseData();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Validacoes", () => {
  it("rejeita valor negativo", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const categoriaId = await getFirstCategoryId();

    const response = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Taxi",
        valor: -10,
        dataDespesa: new Date().toISOString()
      });

    expect(response.status).toBe(400);
  });

  it("rejeita data invalida", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const categoriaId = await getFirstCategoryId();

    const response = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Taxi",
        valor: 50,
        dataDespesa: "data-invalida"
      });

    expect(response.status).toBe(400);
  });
});
