import { prismaMock } from "./lib/prisma/client.mock";

import app from "./app";
import supertest from "supertest";

const request = supertest(app);

describe("POST /cities", () => {
  test("Valid request", async () => {
    const city = {
      id: 26,
      name: "New York",
      european: false,
      country: "USA",
      inhabitants: "1232000",
      region: null,
    };

    //@ts-ignore
    prismaMock.city.create.mockResolvedValue(city);

    const response = await request
      .post("/cities")
      .send({
        //i dati obbligatori
        name: "New York",
        european: false,
        country: "USA",
        inhabitans: "1232000",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(city);
  });

  test("Invalid request", async () => {
    const city = {
      name: "New York",
      european: false,
      // country: "USA",
      //manca il dato inhabitants = la richiesta è invalid
    };
    const response = await request
      .post("/cities")
      .send(city)
      .expect(422) //http status code error 422 = unprocessable entity
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });
});

describe("GET /cities/:id", () => {
  test("Valid request", async () => {
    const city = {
      id: 1,
      name: "Milano",
      european: true,
      country: "Italy",
      inhabitants: "1352000",
    };

    //@ts-ignore
    prismaMock.city.findUnique.mockResolvedValue(city);

    const response = await request
      .get("/cities/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(city);
  });

  test("City does not exist", async () => {
    //@ts-ignore
    prismaMock.city.findUnique.mockResolvedValue(null);
    const response = await request
      .get("/cities/50")
      .expect(404) //http status code error 422 = not found
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot GET /cities/50");
  });
});

describe("PUT /cities/:id", () => {
  test("Valid request", async () => {
    const city = {
      id: 26,
      name: "Milano",
      european: true,
      country: "France",
      inhabitans: 100000,
    };

    // @ts-ignore
    prismaMock.city.update.mockResolvedValue(city);

    const response = await request
      .put("/cities/26")
      .send({
        name: "Milano",
        european: true,
        country: "France",
        inhabitans: 100000,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(city);
  });

  test("Invalid request", async () => {
    const city = {
      name: "Milano",
      european: true,
    };

    const response = await request
      .put("/cities/26")
      .send(city)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });

  test("City does not exist", async () => {
    // @ts-ignore
    prismaMock.city.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .put("/cities/100")
      .send({
        name: "Milano",
        european: true,
        country: "France",
        inhabitans: 100000,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot PUT /cities/100");
  });

  test("Invalid city ID", async () => {
    const response = await request
      .put("/cities/asdf")
      .send({
        name: "Milano",
        european: true,
        country: "France",
        inhabitans: 100000,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot PUT /cities/asdf");
  });
});

describe("DELETE /city/:id", () => {
  test("Valid request", async () => {
    const response = await request.delete("/cities/1").expect(204);

    expect(response.text).toEqual("");
  });

  test("City does not exist", async () => {
    // @ts-ignore
    prismaMock.city.delete.mockRejectedValue(new Error("Error"));

    const response = await request
      .delete("/cities/100")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot DELETE /cities/23");
  });

  test("Invalid city ID", async () => {
    const response = await request
      .delete("/cities/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot DELETE /cities/asdf");
  });
});
