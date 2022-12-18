import { validationErrorMiddleware } from "./lib/middleware/validation/index";
import express from "express";
import "express-async-errors";
import { initCorsMiddleWare } from "./lib/middleware/cors";
import { initSessionMiddleware } from "./lib/middleware/session";
import { passport } from "./lib/middleware/passport";

import routes from "./routes/cities";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());

app.use(initSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use(initCorsMiddleWare());

app.use("/cities", routes);
app.use("/auth", authRoutes);

app.use(validationErrorMiddleware);

export default app;
