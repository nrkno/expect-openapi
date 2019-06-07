import betterAjvErrors from "better-ajv-errors";
import { MatcherState } from "expect";
import { matcherHint } from "jest-matcher-utils";
import RefParser from "json-schema-ref-parser";
import get from "lodash/get";
import { ajvCompile } from "./ajvCompile";

export type Method =
  | "delete"
  | "get"
  | "head"
  | "options"
  | "patch"
  | "post"
  | "put"
  | "trace";

export interface IApiResponse {
  status: number;
  /**
   * content-type
   */
  type: string;
  /**
   * JSON/XML parsed body
   */
  body: any;
}

declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      /**
       * match super agent response against openapi spec
       * @param type openapi.json data, parsed as object
       * @param method the method it matches
       * @param path the path it should match
       */
      toMatchApiResponse(
        schema: any,
        method: Method,
        path: string
      ): Promise<void>;
    }
  }
}
export async function toMatchApiResponse(
  this: MatcherState,
  receivedAny: any,
  openapiSpec: any,
  method: Method,
  path: string
) {
  const options = {
    isNot: this.isNot,
    promise: this.promise
  };
  const isApiResponse =
    typeof receivedAny.status === "number" &&
    typeof receivedAny.type === "string" &&
    "body" in receivedAny;
  // @ts-ignore
  if (!isApiResponse) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `must be superagent response \n` +
        `required props: { status: number, body: any, type: string }`,
      pass: false
    };
  }
  const received: IApiResponse = receivedAny;
  const jsonSchema = await RefParser.dereference(openapiSpec);
  const pathData = get(jsonSchema, `paths.${path}`);
  if (pathData == null) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `schema has no path ${path}`,
      pass: false
    };
  }
  const methodData = pathData[method];
  if (methodData == null) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `${path} has no method ${method}`,
      pass: false
    };
  }
  const responses = methodData.responses || {};
  const response = responses[String(received.status)] || responses.default;
  if (!response) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `paths.${path}.${method}.responses has no responses. Should have either "default" or "${received.status}"`,
      pass: false
    };
  }
  const content = response.content;
  if (!content) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `paths.${path}.${method}.responses.${received.status}.content is empty`,
      pass: false
    };
  }
  const typeData = content[received.type];
  if (!typeData) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `paths.${path}.${method}.responses.${received.status}.content does not have ${received.type}`,
      pass: false
    };
  }
  const schema = typeData.schema;
  if (!schema) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        `paths.${path}.${method}.responses.${received.status}.content.${received.type} does not have a schema`,
      pass: false
    };
  }

  const validate = ajvCompile(schema);
  const body = received.body;
  const pass = await validate(body);
  if (!pass) {
    return {
      message: () =>
        matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
        "\n\n" +
        betterAjvErrors(schema, body, validate.errors, {
          indent: 2
        }),
      pass: false
    };
  }
  return {
    message: () =>
      matcherHint("toMatchOpenapiResponse", undefined, undefined, options) +
      "\n\n" +
      `should be a valid openapi response`,
    pass: true
  };
}
