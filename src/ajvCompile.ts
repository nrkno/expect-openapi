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
 * AJV does not seem to support nullable like openapi3. (??)
 */
export function transformNullable(object: any) {
  if (object.type && object.nullable === true) {
    object.type = [object.type, "null"];
    delete object.nullable;
  }

  if (object.nullable && !object.type && Array.isArray(object.anyOf)) {
    object.anyOf.push({ type: "null" });
  }
  if (object.nullable && !object.type && Array.isArray(object.allOf)) {
    object.allOf.push({ type: "null" });
  }
  if (object.nullable && !object.type && Array.isArray(object.oneOf)) {
    object.oneOf.push({ type: "null" });
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
