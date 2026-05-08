import { Badge } from "./ui/badge";
import type { RefundStatus } from "../types";

const statusStyles: Record<RefundStatus, string> = {
  RASCUNHO: "bg-slate-700 text-white",
  ENVIADO: "bg-amber-500 text-slate-900",
  APROVADO: "bg-emerald-600 text-white",
  REJEITADO: "bg-rose-600 text-white",
  PAGO: "bg-indigo-600 text-white"
};

export default function StatusPill({ status }: { status: RefundStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
