import { Handler } from "aws-lambda";
import { executeFunction } from "./executeFunction";

export const handler: Handler<{
  wsId: string;
  token: string;
  projectId: string;
  reqId: string;
  preloadState: any;
  code: string;
  callArgs?: any[];
}> = async function (event, context) {
  const { code, callArgs, preloadState, ...rest } = event;

  const result = await executeFunction({
    code,
    env: { ...rest, preloadState: JSON.stringify(preloadState) },
    output(e) {
      console.log(e.toString("utf-8"));
    },
    callArgs: [],
  });

  return result;
};
