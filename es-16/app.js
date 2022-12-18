"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
require("express-async-errors");
const prisma = new client_1.PrismaClient();
async function run() {
    const cities = await prisma.city.createMany({
        data: [
            {
                name: "Milano",
                european: true,
                country: "Italy",
                inhabitans: 1352000,
                region: "Lombardia",
            },
            {
                name: "Londra",
                european: false,
                country: "United Kingdom",
                inhabitans: 8982000,
                region: null,
            },
        ],
    });
    console.table(cities);
}
run();
const app = (0, express_1.default)();
app.get("/cities", async (request, response) => {
    const cities = await prisma.city.findMany();
    response.json(cities);
});
exports.default = app;
//# sourceMappingURL=app.js.map