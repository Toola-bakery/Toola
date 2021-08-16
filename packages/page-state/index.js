const WebSocket = require("ws");
const { v4 } = require("uuid");

const preloadState = JSON.parse(process.env.preloadState);

const watchListKeyGetter = (p1, p2) => `["${p1}"]["${p2}"]`;

function getPreloadedState(p1, p2) {
  const key = watchListKeyGetter(p1, p2);
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

const ws = new WebSocket("ws://localhost:8080");

const isWsReadyPromise = new Promise((resolve) => ws.on("open", resolve));

isWsReadyPromise.then();

ws.on("message", function incoming(message) {
  const jsonMessage = JSON.parse(message);
  if (jsonMessage.messageId) {
    mesPromises[jsonMessage.messageId](jsonMessage);
  }
});

function sendToUser(message, awaitResp) {
  const messageId = v4();
  ws.send(
    JSON.stringify({
      ...message,
      messageId,
      destinationId: process.env.wsId,
      reqId: process.env.reqId,
    })
  );
  return awaitResp ? awaitMessageResponse(messageId) : true;
}

async function getProperty(blockId, property) {
  await isWsReadyPromise;
  const value = getPreloadedState(blockId, property);
  if (typeof value !== "undefined") return value;

  const resp = await sendToUser(
    {
      action: "page.getState",
      pageId: "Databases",
      blockId,
      property,
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
      pageId: "Databases",
      blockId,
      method,
      callArgs,
    },
    true
  );

  return resp.value;
}

module.exports = { callMethod, getProperty };
