import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideNav from "../components/SideNav";
import { AuthContext } from "../contexts/AuthContext";
import type { User } from "../types";

const user: User = {
  id: "1",
  nome: "Ana",
  email: "ana@test.local",
  perfil: "FINANCEIRO"
};

describe("Renderizacao condicional", () => {
  it("mostra menu do financeiro", () => {
    render(
      <AuthContext.Provider value={{
        user,
        token: "token",
        loading: false,
        login: jest.fn(),
        logout: jest.fn(),
        hasRole: jest.fn()
      }}>
        <MemoryRouter>
          <SideNav />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/aprovadas/i)).toBeInTheDocument();
  });
});
