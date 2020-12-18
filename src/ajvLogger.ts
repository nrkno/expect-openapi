import Ajv from "ajv";

export const errorLogger: Ajv.CustomLogger = {
  // tslint:disable-next-line:no-console
  error: (...args) => console.log(...args),
  log: () => null,
  warn: () => null,
};
