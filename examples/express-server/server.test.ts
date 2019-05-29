import request from "supertest";
import openapi from "./openapi.json";
import { app, exempt, rated } from "./server";

describe("OpenApi spec examples", () => {
  it("should match LegalAge example", async () => {
    await expect(openapi.components.schemas.LegalAge.example).toMatchRef$(
      openapi,
      "#/components/schemas/LegalAge"
    );
  });
});

describe("constants are valid", () => {
  it("exempt is valid", async () => {
    await expect(exempt).toMatchRef$(openapi, "#/components/schemas/LegalAge");
  });
  it("rated is valid", async () => {
    await expect(rated).toMatchRef$(openapi, "#/components/schemas/LegalAge");
  });
});

describe("Server implements OpenApi", () => {
  // could fetch spec from some where else
  //
  // let openapi: any;
  // beforeAll(async () => {
  //   const res = await fetch(
  //     'https://psapi.nrk.no/documentation/openapi/fargerik/openapi.json'
  //   );
  //   openapi = await res.json();
  // });
  it("should match valid exempt response", async () => {
    const response = await request(app).get("/rating/exempt");
    await expect(response).toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });

  it("should match valid rated response", async () => {
    const response = await request(app).get("/rating/exempt");
    await expect(response).toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
  it("should not match invalid response body", async () => {
    const response = await request(app).get("/rating/exempt-invalid-body");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
  it("should not match invalid content type", async () => {
    const response = await request(app).get("/rating/exempt-invalid-body");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
  it("should not match invalid response type", async () => {
    const response = await request(app).get("/rating/exempt-invalid-body");
    await expect(response).not.toMatchApiResponse(
      openapi,
      "get",
      "/rating/{programId}"
    );
  });
});
