import testApi from "./__fixtures__/test.openapi.json";

describe("toMatchRef$", () => {
  it("should match simple object ref$", async () => {
    await expect({ href: "hello" }).toMatchRef$(
      testApi,
      "#/components/schemas/SimpleLink"
    );
    await expect({ foobar: "hello" }).not.toMatchRef$(
      testApi,
      "#/components/schemas/SimpleLink"
    );
  });
  it("should validate int32", async () => {
    await expect(3).toMatchRef$(testApi, "#/components/schemas/Int32Number");
    await expect(-3).toMatchRef$(testApi, "#/components/schemas/Int32Number");
    // above max
    await expect(2147483647 + 1).not.toMatchRef$(
      testApi,
      "#/components/schemas/Int32Number"
    );
    // below min
    await expect(-2147483648 + -1).not.toMatchRef$(
      testApi,
      "#/components/schemas/Int32Number"
    );
  });
  it("should validate int64", async () => {
    await expect(Number.MAX_SAFE_INTEGER).toMatchRef$(
      testApi,
      "#/components/schemas/Int64Number"
    );
    await expect(Number.MIN_SAFE_INTEGER).toMatchRef$(
      testApi,
      "#/components/schemas/Int64Number"
    );
    // above max
    await expect(Number.MAX_SAFE_INTEGER + 1).not.toMatchRef$(
      testApi,
      "#/components/schemas/Int64Number"
    );
    // below min
    await expect(Number.MIN_SAFE_INTEGER + -1).not.toMatchRef$(
      testApi,
      "#/components/schemas/Int64Number"
    );
  });
});
