import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authController } from "../modules/auth/auth.controller";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);

export default router;
