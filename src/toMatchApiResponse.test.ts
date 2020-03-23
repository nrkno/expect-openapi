import testApi from "./__fixtures__/test.openapi.json";
import { IApiResponse } from "./toMatchApiResponse.js";

describe("api responses", () => {
  it("GET / response should validate", async () => {
    const response: IApiResponse = {
      body: { href: "/" },
      status: 200,
      type: "application/json",
    };
    await expect(response).toMatchApiResponse(testApi, "get", "/");
    await expect(response).not.toMatchApiResponse(testApi, "get", "/number");
  });
  it("GET /number should be valid", async () => {
    const response: IApiResponse = {
      body: 2,
      status: 200,
      type: "application/json",
    };
    await expect(response).toMatchApiResponse(testApi, "get", "/number");
    await expect(response).not.toMatchApiResponse(testApi, "get", "/");
  });
  it("GET /unkown", async () => {
    const response: IApiResponse = {
      body: { unknown: "xxx000000", url: "/something" },
      status: 200,
      type: "application/json",
    };
    await expect(response).toMatchApiResponse(testApi, "get", "/unknown");
  });
});
