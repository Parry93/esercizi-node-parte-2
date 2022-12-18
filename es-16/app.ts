import { PrismaClient } from "@prisma/client";
import express from "express";
import "express-async-errors";

const prisma = new PrismaClient();

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

const app = express();
app.get("/cities", async (request, response) => {
  const cities = await prisma.city.findMany();
  response.json(cities);
});

export default app;
