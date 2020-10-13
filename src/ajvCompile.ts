import Ajv, { NumberFormatDefinition, Options } from "ajv";

/**
 * @param schema dereferenced schema
 */
export const ajvCompile = (
  schema: any,
  {
    unknownFormats = "ignore",
    nullable = true,
    jsonPointers = true,
    ...rest
  }: Options = {}
) => {
  const ajv = new Ajv({
    unknownFormats,
    nullable,
    jsonPointers,
    schemaId: "auto",
    ...rest,
  });
  ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));
  ajv.addFormat("int32", isInt32);
  ajv.addFormat("int64", isInt64);
  ajv.addFormat("url", ""); // the url format is wrong and deprecated

  const clone = JSON.parse(JSON.stringify(schema));
  clone.$schema = "http://json-schema.org/draft-04/schema#";
  transformNullable(clone);
  return ajv.compile(clone);
};

/**
 * JSON Schema does not to support nullable like OpenAPI 3.0.x
 * Transform OpenApi to JSONSchema (best effort)
 */
export function transformNullable(object: any) {
  if (object === null) {
    return;
  }
  if (object.nullable) {
    if (object.enum) {
      object.oneOf = [
        { type: "null" },
        { type: object.type, enum: object.enum },
      ];
      delete object.enum;
      delete object.type;
    } else if (object.type) {
      object.type = [object.type, "null"];
    } else if (Array.isArray(object.anyOf)) {
      object.anyOf.push({ type: "null" });
    } else if (Array.isArray(object.allOf)) {
      object.anyOf = object.allOf;
      object.anyOf.push({ type: "null" });
      delete object.allOf;
    } else if (Array.isArray(object.oneOf)) {
      object.oneOf.push({ type: "null" });
    }
    delete object.nullable;
  }

  Object.keys(object).forEach((attr) => {
    if (object[attr] == null) {
      return;
    }
    if (Array.isArray(object[attr])) {
      object[attr].forEach(transformNullable);
    } else if (typeof object[attr] === "object") {
      transformNullable(object[attr]);
    }
  });
}

const isInt32: NumberFormatDefinition = {
  type: "number",
  validate: (n) => {
    const MIN_INT32 = -2147483648;
    const MAX_INT32 = 2147483647;
    return n <= MAX_INT32 && n >= MIN_INT32;
  },
};

const isInt64: NumberFormatDefinition = {
  type: "number",
  validate: (n) => {
    return n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER;
  },
};
