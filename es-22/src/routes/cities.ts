import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import { validate, citySchema, CityData } from "../lib/middleware/validation";
import { initMulterMiddleware } from "../lib/middleware/multer";
import { checkAuthorization } from "../lib/middleware/passport";

const upload = initMulterMiddleware();
const router = Router();

// API get all cities
router.get("/", async (request, response) => {
  const cities = await prisma.city.findMany();

  response.json(cities);
});

// API get one single city
router.get("/:id(\\d+)", async (request, response, next) => {
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
router.post(
  "/",
  checkAuthorization,
  validate({ body: citySchema }),
  async (request, response) => {
    const cityData: CityData = request.body;
    const username = request.user?.username as string;

    const city = await prisma.city.create({
      data: {
        ...cityData,
        createdBy: username,
        updatedBy: username,
      },
    });

    response.status(201).json(city);
  }
);

router.post(
  "/:id(\\d+)/photo",
  checkAuthorization,
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
router.put(
  "/:id(\\d+)",
  checkAuthorization,
  validate({ body: citySchema }),
  async (request, response, next) => {
    const cityId = Number(request.params.id);
    const cityData: CityData = request.body;
    const username = request.user?.username as string;

    try {
      const city = await prisma.city.update({
        where: { id: cityId },
        data: {
          ...cityData,
          updatedBy: username,
        },
      });

      response.status(200).json(city);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /cities/${cityId}`);
    }
  }
);

// API delete a city record
router.delete(
  "/:id(\\d+)",
  checkAuthorization,
  async (request, response, next) => {
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
  }
);

router.use("/photos", express.static("uploads"));

export default router;
