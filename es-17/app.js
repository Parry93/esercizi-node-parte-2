"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const validation_1 = require("./validation");
const cities_1 = require("./validation/cities");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/cities", async (request, response) => {
    const cities = await prisma.city.findMany();
    response.json(cities);
});
app.post("/cities", (0, validation_1.validate)({ body: cities_1.citySchema }), async (request, response) => {
    const city = request.body;
    response.status(201).json(city);
});
//dopo le api routes
app.use(validation_1.ValidationErrorMiddleWare);
exports.default = app;
//# sourceMappingURL=app.js.map