import { prisma } from "../utils/prisma";
import { app, request, resetDatabase, seedBaseData, defaultPassword } from "./testUtils";

beforeAll(async () => {
  await resetDatabase();
  await seedBaseData();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth", () => {
  it("faz login com credenciais validas", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "colaborador@test.local",
      senha: defaultPassword
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe("colaborador@test.local");
  });

  it("rejeita credenciais invalidas", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "colaborador@test.local",
      senha: "senha-errada"
    });

    expect(response.status).toBe(401);
  });
});
