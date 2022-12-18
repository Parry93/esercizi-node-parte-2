import cors from "cors";

export function initCorsMiddleWare() {
  const corsOptions = {
    origin: "http://localhost:8080",
  };
  return cors(corsOptions);
}
