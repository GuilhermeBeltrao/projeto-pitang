import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Pagina nao encontrada</h1>
      <p className="text-sm text-slate-500">Verifique o endereco digitado.</p>
      <Link to="/">
        <Button>Ir para o inicio</Button>
      </Link>
    </div>
  );
}
