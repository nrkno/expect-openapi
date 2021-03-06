import request from "supertest";
import openapi from "./openapi.json";
import { app } from "./server";

describe("Server implements OpenApi", () => {
  // could fetch spec from some where else
  //
  // let openapi: any;
  // beforeAll(async () => {
  //   const res = await fetch('https://example.com/openapi.json');
  //   openapi = await res.json();
  // });
  it("should match valid exempt response", async () => {
    const response = await request(app).get("/rating/exempt");
    await expect(response).toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
    await expect(response.body.body).toMatchRef$(
      openapi,
      "#/components/schemas/LegalAgeBodyExempt"
    );
  });

  it("should match valid rated response", async () => {
    const response = await request(app).get("/rating/rated");
    await expect(response).toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
    await expect(response.body.body).toMatchRef$(
      openapi,
      "#/components/schemas/LegalAgeBodyRated"
    );
  });
  it("should not match invalid response body", async () => {
    const response = await request(app).get("/rating/invalid-body");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
  it("should not match invalid content type", async () => {
    const response = await request(app).get("/rating/invalid-content-type");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
  it("should not match invalid response status", async () => {
    const response = await request(app).get("/rating/invalid-status");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
});
