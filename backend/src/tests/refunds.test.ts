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

describe("Fluxo de reembolso", () => {
  it("cria, envia, aprova e paga solicitacao", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const tokenGestor = await loginAs(UserRole.GESTOR);
    const tokenFin = await loginAs(UserRole.FINANCEIRO);
    const categoriaId = await getFirstCategoryId();

    const createResponse = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Taxi aeroporto",
        valor: 120,
        dataDespesa: new Date().toISOString()
      });

    expect(createResponse.status).toBe(201);

    const refundId = createResponse.body.id;

    const sendResponse = await request(app)
      .patch(`/refunds/${refundId}/send`)
      .set("Authorization", `Bearer ${tokenColab}`)
      .send();

    expect(sendResponse.body.status).toBe("ENVIADO");

    const approveResponse = await request(app)
      .patch(`/refunds/${refundId}/approve`)
      .set("Authorization", `Bearer ${tokenGestor}`)
      .send();

    expect(approveResponse.body.status).toBe("APROVADO");

    const payResponse = await request(app)
      .patch(`/refunds/${refundId}/pay`)
      .set("Authorization", `Bearer ${tokenFin}`)
      .send();

    expect(payResponse.body.status).toBe("PAGO");
  });

  it("exige justificativa ao rejeitar", async () => {
    const tokenColab = await loginAs(UserRole.COLABORADOR);
    const tokenGestor = await loginAs(UserRole.GESTOR);
    const categoriaId = await getFirstCategoryId();

    const createResponse = await request(app)
      .post("/refunds")
      .set("Authorization", `Bearer ${tokenColab}`)
      .send({
        categoriaId,
        descricao: "Hotel",
        valor: 560,
        dataDespesa: new Date().toISOString()
      });

    const refundId = createResponse.body.id;

    await request(app)
      .patch(`/refunds/${refundId}/send`)
      .set("Authorization", `Bearer ${tokenColab}`)
      .send();

    const rejectResponse = await request(app)
      .patch(`/refunds/${refundId}/reject`)
      .set("Authorization", `Bearer ${tokenGestor}`)
      .send({});

    expect(rejectResponse.status).toBe(400);
  });
});
