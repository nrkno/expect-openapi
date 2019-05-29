import Ajv, { NumberFormatDefinition } from "ajv";

/**
 * @param schema dereferenced schema
 */
export const ajvCompile = (schema: any) => {
  const ajv = new Ajv({
    /**
     * TODO: Add custom format supports for following formats.
     * Maybe add formats from ajv-oai? https://git.io/fj4gs
     */
    unknownFormats: ["float", "double", "byte", "binary", "password"],
    nullable: true,
    jsonPointers: true
  });
  // custom formats
  ajv.addFormat("int32", isInt32);
  ajv.addFormat("int64", isInt64);

  const clone = JSON.parse(JSON.stringify(schema));
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

  Object.keys(object).forEach(attr => {
    if (object[attr] !== null && typeof object[attr] === "object") {
      transformNullable(object[attr]);
    }
  });
}

const isInt32: NumberFormatDefinition = {
  type: "number",
  validate: number => {
    const MIN_INT32 = -2147483648;
    const MAX_INT32 = 2147483647;
    return number <= MAX_INT32 && number >= MIN_INT32;
  }
};

const isInt64: NumberFormatDefinition = {
  type: "number",
  validate: number => {
    return (
      number <= Number.MAX_SAFE_INTEGER && number >= Number.MIN_SAFE_INTEGER
    );
  }
};
