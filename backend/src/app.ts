import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { openapiSpec } from "./docs/openapi";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);
app.use(errorHandler);

export default app;
