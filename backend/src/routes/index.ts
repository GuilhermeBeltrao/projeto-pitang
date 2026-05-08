import { Router } from "express";
import authRoutes from "./auth.routes";
import categoriesRoutes from "./categories.routes";
import refundsRoutes from "./refunds.routes";
import usersRoutes from "./users.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/refunds", refundsRoutes);

export { routes };
