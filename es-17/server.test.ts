import app from "./app";
import supertest from "supertest";

const request = supertest(app);

describe("POST /cities", () => {
  test("Valid request", async () => {
    const city = {
      name: "Milano",
      european: true,
      country: "Italy",
      inhabitants: "1352000",
    };
    const response = await request
      .post("/cities")
      .send(city)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(city);
  });

  test("Invalid request", async () => {
    const city = {
      name: "Milano",
      european: true,
      country: "Italy",
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
