import betterAjvErrors from "better-ajv-errors";
import { MatcherState } from "expect";
import { matcherHint } from "jest-matcher-utils";
import RefParser from "@apidevtools/json-schema-ref-parser";
import { ajvCompile } from "./ajvCompile";
declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R, T> {
      /**
       * match object against openapi ref$
       * @param schema openapi.json schema, parsed as object
       * @param ref$ the type to match against
       */
      toMatchRef$(schema: any, ref$: string): Promise<void>;
    }
  }
}
export async function toMatchRef$(
  this: MatcherState,
  received: any,
  openapiSpec: any,
  ref$: string
) {
  const options = {
    isNot: this.isNot,
    promise: this.promise
  };
  const spec = await RefParser.dereference(openapiSpec);
  const refs$ = await RefParser.resolve(spec);
  const desiredSpec = refs$.get(ref$);
  if (typeof desiredSpec !== "object" || desiredSpec == null) {
    return {
      message: () =>
        matcherHint("toMatchRef$", undefined, undefined, options) +
        "\n\n" +
        `could not resolve ${ref$}`,
      pass: false
    };
  }

  const validate = ajvCompile(desiredSpec);
  const pass = await validate(received);
  if (!pass) {
    return {
      message: () =>
        matcherHint("toMatchRef$", undefined, undefined, options) +
        "\n\n" +
        betterAjvErrors(desiredSpec, received, validate.errors, {
          indent: 2
        }),
      pass: false
    };
  }
  return {
    message: () =>
      matcherHint("toMatchRef$", undefined, undefined, options) +
      "\n\n" +
      `should match schema at ${ref$}`,
    pass: true
  };
}
