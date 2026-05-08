import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

const loginMock = jest.fn().mockResolvedValue(undefined);

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ login: loginMock })
}));

describe("Login", () => {
  it("valida campos obrigatorios", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/email invalido/i)).toBeInTheDocument();
    expect(await screen.findByText(/senha minima/i)).toBeInTheDocument();
  });

  it("envia credenciais validas", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "user@test.local");
    await userEvent.type(screen.getByLabelText(/senha/i), "Passw0rd!");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(loginMock).toHaveBeenCalledWith("user@test.local", "Passw0rd!");
  });
});
