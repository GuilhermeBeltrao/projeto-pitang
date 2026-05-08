import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { refundsController } from "../modules/refunds/refunds.controller";
import { historyController } from "../modules/refunds/history.controller";
import {
  refundCreateSchema,
  refundParamsSchema,
  refundPurgeSchema,
  refundQuerySchema,
  refundUpdateSchema
} from "../schemas/refund.schema";
import {
  refundApproveSchema,
  refundPaySchema,
  refundRejectSchema,
  refundSendSchema
} from "../schemas/workflow.schema";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware);

router.get("/", validate(refundQuerySchema), refundsController.list);
router.delete("/purge", authorizeRoles(UserRole.ADMIN), validate(refundPurgeSchema), refundsController.purge);
router.get("/:id", validate(refundParamsSchema), refundsController.getById);
router.post("/", authorizeRoles(UserRole.COLABORADOR), validate(refundCreateSchema), refundsController.create);
router.put("/:id", authorizeRoles(UserRole.COLABORADOR), validate(refundUpdateSchema), refundsController.update);
router.delete("/:id", authorizeRoles(UserRole.COLABORADOR), validate(refundParamsSchema), refundsController.remove);

router.patch("/:id/send", authorizeRoles(UserRole.COLABORADOR), validate(refundSendSchema), refundsController.send);
router.patch("/:id/approve", authorizeRoles(UserRole.GESTOR), validate(refundApproveSchema), refundsController.approve);
router.patch("/:id/reject", authorizeRoles(UserRole.GESTOR), validate(refundRejectSchema), refundsController.reject);
router.patch("/:id/pay", authorizeRoles(UserRole.FINANCEIRO), validate(refundPaySchema), refundsController.pay);

router.get("/:id/history", validate(refundParamsSchema), historyController.list);

export default router;
