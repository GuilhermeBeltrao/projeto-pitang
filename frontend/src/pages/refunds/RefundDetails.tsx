import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getRefund, listRefundHistory } from "../../services/refunds";
import type { Refund } from "../../types";
import LoadingState from "../../components/LoadingState";
import StatusPill from "../../components/StatusPill";

export default function RefundDetails() {
  const { id } = useParams();
  const [refund, setRefund] = useState<Refund | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getRefund(id), listRefundHistory(id)]).then(([data, historyData]) => {
      setRefund(data);
      setHistory(historyData);
      setLoading(false);
    });
  }, [id]);

  if (loading || !refund) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da solicitacao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Descricao</p>
              <p className="font-semibold">{refund.descricao}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Categoria</p>
              <p className="font-semibold">{refund.categoria?.nome}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Valor</p>
              <p className="font-semibold">R$ {refund.valor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <StatusPill status={refund.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200/70 p-3">
                <p className="text-sm font-semibold">{item.acao}</p>
                <p className="text-xs text-slate-500">{item.usuario?.nome}</p>
                {item.observacao && <p className="text-xs mt-1">{item.observacao}</p>}
              </div>
            ))}
            {!history.length && <p className="text-sm text-slate-500">Sem historico.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
