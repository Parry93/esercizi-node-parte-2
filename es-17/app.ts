import { PrismaClient } from "@prisma/client";
import express from "express";
import "express-async-errors";
import { validate, ValidationErrorMiddleWare } from "./validation";
import { citySchema, CityData } from "./validation/cities";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/cities", async (request, response) => {
  const cities = await prisma.city.findMany();
  response.json(cities);
});

app.post(
  "/cities",
  validate({ body: citySchema }),
  async (request, response) => {
    const city: CityData = request.body;
    response.status(201).json(city);
  }
);

//dopo le api routes
app.use(ValidationErrorMiddleWare);

export default app;
