import { validationErrorMiddleware } from "./lib/middleware/validation/index";
import express from "express";
import "express-async-errors";
import { initCorsMiddleWare } from "./lib/middleware/cors";

import routes from "./routes/cities";

const app = express();

app.use(express.json());

app.use(initCorsMiddleWare());

app.use("/cities", routes);

app.use(validationErrorMiddleware);

export default app;
