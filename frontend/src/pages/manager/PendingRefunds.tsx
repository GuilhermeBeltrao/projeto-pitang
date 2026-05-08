import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import LoadingState from "../../components/LoadingState";
import StatusPill from "../../components/StatusPill";
import { approveRefund, listRefunds, rejectRefund } from "../../services/refunds";
import type { Refund } from "../../types";

export default function PendingRefunds() {
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  const loadRefunds = async () => {
    setLoading(true);
    const response = await listRefunds({ page: 1, pageSize: 20, status: "ENVIADO" });
    setRefunds(response.items);
    setLoading(false);
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleApprove = async (id: string) => {
    await approveRefund(id);
    toast.success("Solicitacao aprovada");
    loadRefunds();
  };

  const handleReject = async (id: string) => {
    const note = rejectNotes[id];
    if (!note) {
      toast.error("Informe a justificativa");
      return;
    }
    await rejectRefund(id, note);
    toast.success("Solicitacao rejeitada");
    loadRefunds();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitacoes pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund.id} className="rounded-xl border border-slate-200/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{refund.descricao}</p>
                  <p className="text-xs text-slate-500">{refund.solicitante?.nome}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={refund.status} />
                  <span className="text-sm font-semibold">R$ {refund.valor}</span>
                </div>
              </div>
              <Input
                placeholder="Justificativa de rejeicao"
                value={rejectNotes[refund.id] ?? ""}
                onChange={(event) =>
                  setRejectNotes((prev) => ({ ...prev, [refund.id]: event.target.value }))
                }
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(refund.id)}>
                  Aprovar
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleReject(refund.id)}>
                  Rejeitar
                </Button>
              </div>
            </div>
          ))}
          {!refunds.length && <p className="text-sm text-slate-500">Nenhuma pendencia.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
