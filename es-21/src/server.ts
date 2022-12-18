import app from "./app";
import "dotenv/config";
import config from "./config";

const port = config.PORT;

app.listen(port, () => {
  console.log(`Server runs at localhost:${port}`);
});
