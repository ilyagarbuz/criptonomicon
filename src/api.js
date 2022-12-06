const API_KEY =
  "73f8eac5b3e2b51b5a1e728a8b254f3367aca5551bc47a61a177ddd04dab5b0d";
const AGRGADE_INDEX = 5;

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
socket.addEventListener("message", (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: price } = JSON.parse(e.data);

  if (type != AGRGADE_INDEX || price === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(price));
});

const sendToWebSocket = (message) => {
  const stringifyedMsg = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyedMsg);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifyedMsg);
    },
    { once: true }
  );
};

const subscribeToTickerOnWs = (ticker) => {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
};

const unsubscribeFromTickerOnWs = (ticker) => {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribes = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribes, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

window.tickersHandlers = tickersHandlers;
