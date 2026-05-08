import { RefundStatus } from "@prisma/client";

export const REFUND_EDITABLE_STATUSES: RefundStatus[] = [
	RefundStatus.RASCUNHO,
	RefundStatus.REJEITADO
];
export const REFUND_SEND_STATUSES: RefundStatus[] = [
	RefundStatus.RASCUNHO,
	RefundStatus.REJEITADO
];
