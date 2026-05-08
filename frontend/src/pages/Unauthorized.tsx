import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Acesso negado</h1>
      <p className="text-sm text-slate-500">Seu perfil nao possui permissao para esta rota.</p>
      <Link to="/">
        <Button>Voltar ao dashboard</Button>
      </Link>
    </div>
  );
}
