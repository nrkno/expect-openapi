import Ajv from "ajv";
import betterAjvErrors from "better-ajv-errors";
import chalk from "chalk";

export function getErrorMessage(
  schema: any,
  received: any,
  errors: Ajv.ErrorObject[] | null | undefined,
  { bailFast }: { bailFast: boolean }
) {
  const errs = errors || [];
  if (!bailFast || errs.length < 20) {
    return betterAjvErrors(schema, received, errs, {
      indent: 2,
    });
  } else {
    let messageToPrint = "received\n";
    errs.forEach((error) => {
      let line = `${error.dataPath} ${error.message}`;

      if (error.keyword === "additionalProperties") {
        line += `, but found '${
          // @ts-ignore
          error.params.additionalProperty
        }'`;
      }

      messageToPrint += chalk.red(`  ${line}\n`);
    });
    return messageToPrint;
  }
}
