import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

const STORAGE_THEME = "theme";

type TopNavProps = {
  onMenuToggle?: () => void;
};

export default function TopNav({ onMenuToggle }: TopNavProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_THEME) as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_THEME, next);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Controle de reembolsos</p>
        <h1 className="text-base font-semibold md:text-lg">Bem-vindo, {user?.nome}</h1>
      </div>
      <div className="flex items-center gap-2">
        {onMenuToggle && (
          <Button variant="outline" size="sm" className="lg:hidden" onClick={onMenuToggle}>
            <Menu size={16} />
            <span className="ml-2">Menu</span>
          </Button>
        )}
        <Button variant="subtle" size="sm" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span className="ml-2">Tema</span>
        </Button>
        <Button variant="outline" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
