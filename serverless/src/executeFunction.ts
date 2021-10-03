import { spawn } from "child_process";
import { parse, stringify } from "flatted";

type ExecuteFunctionOptions = {
  code: string;
  output: (chunk: Buffer) => void;
  callArgs?: any[];
  mainFunctionName?: string;
  env?: { [key: string]: string };
};

export function executeFunction({
  code,
  output,
  callArgs,
  env,
  mainFunctionName = "main",
}: ExecuteFunctionOptions): Promise<number | string | void> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString();
    const callFunctionWithArgs = callArgs
      ? `
			const {stringify:_stringify} = require("flatted");
			(async ()=>${mainFunctionName}(${callArgs
          .map((v) => JSON.stringify(v))
          .join(", ")}))()
			.then(result=>process.stdout.write("${id}"+_stringify(result)+"${id}"))`
      : "";

    const source = `${code}; ${callFunctionWithArgs}`;

    const node = spawn("node", ["-e", source], {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
    });

    let mentionedOnce = false;
    let madeFullResponse = false;
    let response = "";

    function catchData(data: Buffer) {
      const stringData = data.toString("utf-8");
      if (!madeFullResponse && (stringData.includes(id) || mentionedOnce)) {
        if (!mentionedOnce) {
          const batch = stringData.split(id);
          if (batch[0]) output(Buffer.from(batch[0]));
          response += batch[1];
          if (batch.length === 3) {
            madeFullResponse = true;
            resolve(response);
            if (batch[2]) output(Buffer.from(batch[2]));
          }
          mentionedOnce = true;
        } else {
          response += stringData;
          const batch = response.split(id);

          if (batch.length >= 2) {
            // eslint-disable-next-line prefer-destructuring
            response = batch[0];
            madeFullResponse = true;
            resolve(response);
          }

          if (batch[1]) output(Buffer.from(batch[1]));
        }
      } else output(data);
    }

    node.stdout.on("data", catchData);
    node.stderr.on("data", output);

    node.on("close", (exitCode, signal) => {
      if (!exitCode) resolve();
      reject(new Error(`exit code ${exitCode}`));
      console.log(`child process exited with code ${exitCode}`, signal);
    });
  });
}
