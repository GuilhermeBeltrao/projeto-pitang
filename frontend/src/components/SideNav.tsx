import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";
import { cn } from "../lib/utils";

export const navByRole: Record<UserRole, { label: string; to: string }[]> = {
  COLABORADOR: [
    { label: "Dashboard", to: "/" },
    { label: "Minhas solicitacoes", to: "/minhas-solicitacoes" },
    { label: "Nova solicitacao", to: "/solicitacoes/nova" }
  ],
  GESTOR: [
    { label: "Dashboard", to: "/" },
    { label: "Pendentes", to: "/gestor/pendentes" }
  ],
  FINANCEIRO: [
    { label: "Dashboard", to: "/" },
    { label: "Aprovadas", to: "/financeiro/aprovadas" }
  ],
  ADMIN: [
    { label: "Dashboard", to: "/" },
    { label: "Usuarios", to: "/admin/usuarios" },
    { label: "Categorias", to: "/admin/categorias" }
  ]
};

export default function SideNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-6 border-r border-slate-200/70 px-6 py-8 dark:border-slate-800/60">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Menu</p>
        <h2 className="text-lg font-semibold">Perfil {user.perfil}</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navByRole[user.perfil].map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-accent text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
