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
      "#/components/schemas/Int32Number",
      { bailFast: true }
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
  it("should handle optional props", async () => {
    await expect({}).toMatchRef$(
      testApi,
      "#/components/schemas/OptionalTypeProp"
    );
  });
  it("should handle required props", async () => {
    await expect({}).not.toMatchRef$(
      testApi,
      "#/components/schemas/RequiredTypeProp"
    );
    await expect({ required: "yes" }).toMatchRef$(
      testApi,
      "#/components/schemas/RequiredTypeProp"
    );
  });
  it("should handle nullable props", async () => {
    await expect({}).not.toMatchRef$(
      testApi,
      "#/components/schemas/NullableTypeProp"
    );
    await expect({ nullable: null }).toMatchRef$(
      testApi,
      "#/components/schemas/NullableTypeProp"
    );
    await expect({ nullable: "nullable" }).toMatchRef$(
      testApi,
      "#/components/schemas/NullableTypeProp"
    );
  });
  it("should handle example", async () => {
    await expect({ id: "hello" }).toMatchRef$(
      testApi,
      "#/components/schemas/WithExample"
    );
  });
  it("should handle nullable array", async () => {
    await expect({ nullable: null }).toMatchRef$(
      testApi,
      "#/components/schemas/NullableOneOf"
    );
  });
  it("should handle nullable enum", async () => {
    await expect({ value: null }).toMatchRef$(
      testApi,
      "#/components/schemas/NullableEnum"
    );
    await expect({ value: "hello" }).toMatchRef$(
      testApi,
      "#/components/schemas/NullableEnum"
    );
  });
});
