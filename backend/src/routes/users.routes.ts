import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { usersController } from "../modules/users/users.controller";
import { userCreateSchema, userParamsSchema, userUpdateSchema } from "../schemas/user.schema";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.ADMIN));

router.get("/", usersController.list);
router.post("/", validate(userCreateSchema), usersController.create);
router.put("/:id", validate(userUpdateSchema), usersController.update);
router.delete("/:id", validate(userParamsSchema), usersController.remove);

export default router;
