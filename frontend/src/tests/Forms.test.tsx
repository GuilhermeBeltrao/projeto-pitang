import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NewRefund from "../pages/refunds/NewRefund";

jest.mock("../services/categories", () => ({
  listCategories: jest.fn().mockResolvedValue([
    { id: "1", nome: "Transporte", ativo: true }
  ])
}));

jest.mock("../services/refunds", () => ({
  createRefund: jest.fn().mockResolvedValue({})
}));

describe("Formulario de reembolso", () => {
  it("valida campos obrigatorios", async () => {
    render(
      <MemoryRouter>
        <NewRefund />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /criar solicitacao/i }));

    expect(await screen.findByText(/categoria obrigatoria/i)).toBeInTheDocument();
    expect(await screen.findByText(/descricao obrigatoria/i)).toBeInTheDocument();
  });
});
