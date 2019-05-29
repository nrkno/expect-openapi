import openapi from "./openapi.json";

describe("OpenApi spec examples", () => {
  it("should match LegalAge example", async () => {
    await expect(openapi.components.schemas.LegalAge.example).toMatchRef$(
      openapi,
      "#/components/schemas/LegalAge"
    );
  });
});

describe("Did I write my schemas correctly?", () => {
  it("exempt is valid", async () => {
    await expect({
      legalReference: "LOV2015-02-06-7",
      body: { status: "exempt" }
    }).toMatchRef$(openapi, "#/components/schemas/LegalAge");
  });
  it("rated is valid", async () => {
    await expect({
      legalReference: "LOV2015-02-06-7",
      body: {
        rating: {
          code: "12",
          displayValue: "Aldersgrense 12 år",
          displayAge: "12+"
        },
        status: "rated"
      }
    }).toMatchRef$(openapi, "#/components/schemas/LegalAge");
  });
});
