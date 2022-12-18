import app from "./app";
import supertest from "supertest";
import { prismaMock } from "./src/lib/prisma/client.mock";

const request = supertest(app);
test("GET /cities", async () => {
  const cities = [
    {
      name: "Milano",
      european: true,
      country: "Italy",
      inhabitants: "1352000",
      region: "Lombardia",
    },
    {
      name: "Londra",
      european: false,
      country: "United Kingdom",
      inhabitants: "8982000",
      region: null,
    },
  ];
  //@ts-ignore
  prismaMock.city.findMany.mockResolvedValue(cities);

  const response = await request
    .get("/cities")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toEqual(cities);
});
