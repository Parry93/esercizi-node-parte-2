import { RequestHandler } from "express";

//mi serve un mock per fare il test anche se non sono in effetti loggato
jest.mock("./passport", () => {
  const originalModule = jest.requireActual("./passport");

  const checkAuthorization: RequestHandler = (request, response, next) => {
    next();
  };

  return {
    __esModule: true,
    ...originalModule,
    checkAuthorization,
  };
});
