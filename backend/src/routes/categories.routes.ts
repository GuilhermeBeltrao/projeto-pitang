import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validate.middleware";
import { categoriesController } from "../modules/categories/categories.controller";
import { categoryCreateSchema, categoryParamsSchema, categoryUpdateSchema } from "../schemas/category.schema";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authMiddleware);

router.get("/", categoriesController.list);
router.post("/", authorizeRoles(UserRole.ADMIN), validate(categoryCreateSchema), categoriesController.create);
router.put("/:id", authorizeRoles(UserRole.ADMIN), validate(categoryUpdateSchema), categoriesController.update);
router.delete("/:id", authorizeRoles(UserRole.ADMIN), validate(categoryParamsSchema), categoriesController.remove);

export default router;
