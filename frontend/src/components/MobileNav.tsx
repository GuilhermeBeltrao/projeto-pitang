import { X } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import { navByRole } from "./SideNav";
import { Button } from "./ui/button";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [location.pathname]);

  if (!user) {
    return null;
  }

  return (
    <div className={cn("lg:hidden", open ? "" : "pointer-events-none")}>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform dark:bg-slate-950",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Menu</p>
            <p className="text-sm font-semibold">Perfil {user.perfil}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
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
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
