import { prismaMock } from "./src/lib/prisma/client.mock";
import app from "./app";
import "dotenv/config";
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server runs at localhost:${port}`);
});
