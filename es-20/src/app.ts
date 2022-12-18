import { initMulterMiddleware } from "./lib/middleware/multer";
import express from "express";
import "express-async-errors";
import cors from "cors";

import prisma from "./lib/prisma/client";

import {
  validate,
  validationErrorMiddleware,
  citySchema,
  CityData,
} from "./lib/validation";

const upload = initMulterMiddleware();

const app = express();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));

// API get all cities
app.get("/cities", async (request, response) => {
  const cities = await prisma.city.findMany();

  response.json(cities);
});

// API get one single city
app.get("/cities/:id(\\d+)", async (request, response, next) => {
  const cityId = Number(request.params.id);

  const city = await prisma.city.findUnique({
    where: { id: cityId },
  });

  if (!city) {
    response.status(404);
    return next(`Cannot GET /cities/${cityId}`);
  }

  response.json(city);
});

//API post
app.post(
  "/cities",
  validate({ body: citySchema }),
  async (request, response) => {
    const cityData: CityData = request.body;

    const city = await prisma.city.create({
      data: cityData,
    });

    response.status(201).json(city);
  }
);

app.post(
  "/cities/:id(\\d+)/photo",
  upload.single("photo"),
  async (request, response, next) => {
    if (!request.file) {
      response.status(400);
      return next("No photo file uploaded.");
    }

    const cityId = Number(request.params.id);
    const photoFilename = request.file.filename;

    try {
      await prisma.city.update({
        where: { id: cityId },
        data: { photoFilename },
      });

      response.status(201).json({ photoFilename });
    } catch (error) {
      response.status(404);
      next(`Cannot POST /planets/${cityId}/photo`);
    }
  }
);

// API put - modify a city record
app.put(
  "/cities/:id(\\d+)",
  validate({ body: citySchema }),
  async (request, response, next) => {
    const cityId = Number(request.params.id);
    const cityData: CityData = request.body;

    try {
      const city = await prisma.city.update({
        where: { id: cityId },
        data: cityData,
      });

      response.status(200).json(city);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /cities/${cityId}`);
    }
  }
);

// API delete a city record
app.delete("/cities/:id(\\d+)", async (request, response, next) => {
  const cityId = Number(request.params.id);

  try {
    await prisma.city.delete({
      where: { id: cityId },
    });

    response.status(204).end();
  } catch (error) {
    response.status(404);
    next(`Cannot DELETE /cities/${cityId}`);
  }
});

app.use(validationErrorMiddleware);

app.use("/cities/photos", express.static("uploads"));

export default app;
