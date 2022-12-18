"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("dotenv/config");
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`Server runs at localhost:${port}`);
});
//# sourceMappingURL=server.js.map