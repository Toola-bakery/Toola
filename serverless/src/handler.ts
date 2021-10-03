import { Handler } from "aws-lambda";
import WebSocket from "ws";
import { v4 } from "uuid";
import { executeFunction } from "./executeFunction";

let resolve = () => {};
const isWsReadyPromise = new Promise<void>((_resolve) => (resolve = _resolve));
isWsReadyPromise.then();

export const handler: Handler<{
  wsId: string;
  token: string;
  projectId: string;
  reqId: string;
  preloadState: any;
  code: string;
  callArgs?: any[];
}> = async function (event, context) {
  const {
    code,
    callArgs,
    preloadState,
    wsId,
    token,
    reqId,
    projectId,
    ...rest
  } = event;

  const ws = new WebSocket("wss://workspace-5wcfu.ondigitalocean.app");

  ws.on("message", function incoming(message) {
    const jsonMessage = JSON.parse(message.toString("utf-8"));
    console.log("ws inited", jsonMessage);

    if (jsonMessage.action === "init") {
      ws.send(
        JSON.stringify({
          action: "init",
          id: jsonMessage.id,
          projectId,
          token,
        })
      );
    }
    if (jsonMessage.action === "auth.success") {
      resolve();
    }
  });

  async function sendToUser(message) {
    await isWsReadyPromise;

    const messageId = v4();
    const jsonMessage = JSON.stringify({
      ...message,
      messageId,
      destinationId: wsId,
      id: reqId,
    });
    ws.send(jsonMessage);
  }

  const result = await executeFunction({
    code,
    env: {
      ...rest,
      wsId,
      token,
      reqId,
      projectId,
      API_HOST: "workspace-5wcfu.ondigitalocean.app",
      preloadState: JSON.stringify(preloadState),
    },
    output(data) {
      console.log("output");
      sendToUser({
        action: "function.output",
        data: data.toString("utf-8"),
      });
    },
    callArgs: [],
  }).catch(() => sendToUser({ action: "function.end", result: "error" }));

  return result;
};
