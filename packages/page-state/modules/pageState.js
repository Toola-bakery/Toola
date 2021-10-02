const WebSocket = require("ws");
const { v4 } = require("uuid");

const ALLOWED_TOP_LEVEL_KEYS = ["blocks", "globals"];

const preloadState = JSON.parse(process.env.preloadState);

const watchListKeyGetter = (keys) => keys.map((p1) => `["${p1}"]`).join("");

function getPreloadedState(keys) {
  const key = watchListKeyGetter(keys);
  const value = preloadState[key];
  if (typeof value !== "undefined") {
    delete preloadState[key];
    return value;
  }
}

const mesPromises = {};

function awaitMessageResponse(messageId) {
  const p = new Promise((resolve, reject) => {
    mesPromises[messageId] = resolve;
  });
  p.then();
  return p;
}

const API_HOST = process.env.API_HOST
  ? `wss://${process.env.API_HOST}`
  : "ws://localhost:8080";

const ws = new WebSocket(API_HOST);

let resolve = () => {};
const isWsReadyPromise = new Promise((_resolve) => (resolve = _resolve));

isWsReadyPromise.then();

ws.on("message", function incoming(message) {
  const jsonMessage = JSON.parse(message);

  if (jsonMessage.action === "init") {
    ws.send(
      JSON.stringify({
        action: "init",
        id: jsonMessage.id,
        token: process.env.token,
      })
    );
    resolve();
  } else if (jsonMessage.messageId) {
    mesPromises[jsonMessage.messageId](jsonMessage);
  }
});

async function sendToUser(message, awaitResp) {
  const messageId = v4();
  const jsonMessage = JSON.stringify({
    ...message,
    messageId,
    destinationId: process.env.wsId,
    reqId: process.env.reqId,
  });
  ws.send(jsonMessage);
  return awaitResp ? awaitMessageResponse(messageId) : true;
}

async function getProperty(...keys) {
  await isWsReadyPromise;
  const value = getPreloadedState(
    ALLOWED_TOP_LEVEL_KEYS.includes(keys[0]) ? keys : ["blocks", ...keys]
  );

  if (typeof value !== "undefined") return value;

  const resp = await sendToUser(
    {
      action: "page.getState",
      keys,
    },
    true
  );

  return resp.value;
}

async function callMethod(blockId, method, callArgs = []) {
  await isWsReadyPromise;
  const resp = await sendToUser(
    {
      action: "page.call",
      blockId,
      method,
      callArgs,
    },
    true
  );

  return resp.value;
}

module.exports = {
  callMethod,
  getProperty,
};
