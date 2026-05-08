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

describe("RBAC", () => {
  it("bloqueia colaborador tentando aprovar", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const categoriaId = await getFirstCategoryId();

    const createResponse = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Almoco",
        valor: 80,
        dataDespesa: new Date().toISOString()
      });

    const refundId = createResponse.body.id;

    await request(app)
      .patch(`/refunds/${refundId}/send`)
      .set("Authorization", `Bearer ${tokenColab}`)
      .send();

    const approveResponse = await request(app)
      .patch(`/refunds/${refundId}/approve`)
      .set("Authorization", `Bearer ${tokenColab}`)
      .send();

    expect(approveResponse.status).toBe(403);
  });

  it("bloqueia gestor tentando pagar", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const tokenGestor = await loginAs(UserRole.GESTOR);
    const categoriaId = await getFirstCategoryId();

    const createResponse = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Hospedagem",
        valor: 420,
        dataDespesa: new Date().toISOString()
      });

    const refundId = createResponse.body.id;

    await request(app)
      .patch(`/refunds/${refundId}/send`)
      .set("Authorization", `Bearer ${tokenColab}`)
      .send();

    await request(app)
      .patch(`/refunds/${refundId}/approve`)
      .set("Authorization", `Bearer ${tokenGestor}`)
      .send();

    const payResponse = await request(app)
      .patch(`/refunds/${refundId}/pay`)
      .set("Authorization", `Bearer ${tokenGestor}`)
      .send();

    expect(payResponse.status).toBe(403);
  });
});
