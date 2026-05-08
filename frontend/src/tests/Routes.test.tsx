import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../routes";
import { AuthContext } from "../contexts/AuthContext";
import type { User } from "../types";

const baseUser: User = {
  id: "1",
  nome: "Ana",
  email: "ana@test.local",
  perfil: "COLABORADOR"
};

describe("Rotas privadas", () => {
  it("redireciona para login quando nao autenticado", () => {
    render(
      <AuthContext.Provider value={{
        user: null,
        token: null,
        loading: false,
        login: jest.fn(),
        logout: jest.fn(),
        hasRole: jest.fn()
      }}>
        <MemoryRouter initialEntries={["/"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/controle de reembolsos/i)).toBeInTheDocument();
  });

  it("redireciona para unauthorized quando perfil nao permitido", () => {
    render(
      <AuthContext.Provider value={{
        user: baseUser,
        token: "token",
        loading: false,
        login: jest.fn(),
        logout: jest.fn(),
        hasRole: (roles) => roles.includes(baseUser.perfil)
      }}>
        <MemoryRouter initialEntries={["/admin/usuarios"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/acesso negado/i)).toBeInTheDocument();
  });
});
