import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import LoadingState from "../../components/LoadingState";
import StatusPill from "../../components/StatusPill";
import { listRefunds, payRefund } from "../../services/refunds";
import type { Refund } from "../../types";

export default function ApprovedRefunds() {
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<Refund[]>([]);

  const loadRefunds = async () => {
    setLoading(true);
    const response = await listRefunds({ page: 1, pageSize: 20, status: "APROVADO" });
    setRefunds(response.items);
    setLoading(false);
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handlePay = async (id: string) => {
    await payRefund(id);
    toast.success("Pagamento confirmado");
    loadRefunds();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitacoes aprovadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 p-4">
              <div>
                <p className="font-semibold">{refund.descricao}</p>
                <p className="text-xs text-slate-500">{refund.solicitante?.nome}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={refund.status} />
                <Button size="sm" onClick={() => handlePay(refund.id)}>
                  Marcar como paga
                </Button>
              </div>
            </div>
          ))}
          {!refunds.length && <p className="text-sm text-slate-500">Nenhuma aprovada.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
