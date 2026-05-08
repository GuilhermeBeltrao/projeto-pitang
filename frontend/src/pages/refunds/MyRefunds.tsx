import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import StatusPill from "../../components/StatusPill";
import { listRefunds, sendRefund } from "../../services/refunds";
import type { Refund } from "../../types";
import { toast } from "sonner";

export default function MyRefunds() {
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const loadRefunds = async (status?: string) => {
    setLoading(true);
    const response = await listRefunds({ page: 1, pageSize: 20, status });
    setRefunds(response.items);
    setLoading(false);
  };

  useEffect(() => {
    loadRefunds(statusFilter || undefined);
  }, [statusFilter]);

  const handleSend = async (id: string) => {
    await sendRefund(id);
    toast.success("Solicitacao enviada");
    loadRefunds();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas solicitacoes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">Filtrar por status</label>
          <select
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Todos</option>
            {["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "PAGO"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 p-4">
              <div>
                <p className="font-semibold">{refund.descricao}</p>
                <p className="text-xs text-slate-500">{refund.categoria?.nome ?? "Sem categoria"}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={refund.status} />
                <Link to={`/solicitacoes/${refund.id}`}>
                  <Button size="sm" variant="outline">Detalhes</Button>
                </Link>
                {(refund.status === "RASCUNHO" || refund.status === "REJEITADO") && (
                  <>
                    <Link to={`/solicitacoes/${refund.id}/editar`}>
                      <Button size="sm" variant="subtle">Editar</Button>
                    </Link>
                    <Button size="sm" onClick={() => handleSend(refund.id)}>
                      Enviar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!refunds.length && (
            <EmptyState
              title="Sem solicitacoes"
              description="Crie sua primeira solicitacao de reembolso."
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
