import { prismaMock } from "../lib/prisma/client.mock";

import app from "../app";
import supertest from "supertest";

const request = supertest(app);

describe("POST /cities", () => {
  test("Valid request", async () => {
    const city = {
      id: 3,
      name: "Boston",
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
        name: "Boston",
        european: false,
        country: "USA",
        inhabitans: "1232000",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

    expect(response.body).toEqual(city);
  });

  test("Invalid request", async () => {
    const city = {
      name: "Boston",
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
      inhabitants: "100000",
    };

    //@ts-ignore
    prismaMock.city.findUnique.mockResolvedValue(city);

    const response = await request
      .get("/cities/1")
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

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
      id: 1,
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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

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
      .expect("Content-Type", /text\/html/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

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

describe("POST /cities/:id/photo", () => {
  test("Valid request with a PNG uploaded", async () => {
    await request
      .post("/cities/1/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(201) // successfull
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
  });

  test("Valid request with a JPG uploaded", async () => {
    await request
      .post("/cities/1/photo")
      .attach("photo", "test-fixtures/photos/file.jpg")
      .expect(201) // successfull
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
  });

  test("Not existing ID indicated when uploading a file", async () => {
    //@ts-ignore
    prismaMock.city.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .post("/cities/100/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot POST /cities/100/photo");
  });

  test("Invalid ID indicated when uploading a file", async () => {
    const response = await request
      .post("/cities/asdf/photo")
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot POST /cities/asdf/photo");
  });

  test("Invalid request with no file uploaded", async () => {
    const response = await request
      .post("/cities/1/photo")
      .expect(400) // client error, it indicates that the request is INCORRECT
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("No photo uploaded");
  });

  test("Invalid request with txt file upload", async () => {
    const response = await request
      .post("/cities/1/photo")
      .attach("photo", "test-fixtures/photos/file.txt")
      .expect(500)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain(
      "Error: the uploaded file must be a png or jpg image"
    );
  });
});
