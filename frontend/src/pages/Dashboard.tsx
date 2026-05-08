import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { listRefunds } from "../services/refunds";
import { useAuth } from "../contexts/AuthContext";
import type { Refund } from "../types";
import StatusPill from "../components/StatusPill";

export default function Dashboard() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<Refund[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await listRefunds({ page: 1, pageSize: 6 });
      setRecent(response.items);
      setTotal(response.meta.total);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de solicitacoes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{total}</p>
            <p className="text-sm text-slate-500">Visao do seu perfil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perfil ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{user?.perfil}</p>
            <p className="text-sm text-slate-500">Controle por regras de acesso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fluxo protegido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">RBAC + JWT</p>
            <p className="text-sm text-slate-500">Seguranca ponta a ponta</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ultimas solicitacoes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recent.map((refund) => (
              <div
                key={refund.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 p-4"
              >
                <div>
                  <p className="font-semibold">{refund.descricao}</p>
                  <p className="text-xs text-slate-500">{refund.categoria?.nome ?? "Sem categoria"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">R$ {refund.valor}</span>
                  <StatusPill status={refund.status} />
                </div>
              </div>
            ))}
            {!recent.length && <p className="text-sm text-slate-500">Nenhuma solicitacao encontrada.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
