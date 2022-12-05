const API_KEY =
  "73f8eac5b3e2b51b5a1e728a8b254f3367aca5551bc47a61a177ddd04dab5b0d";

const tickersHandlers = new Map();

const loadTickers = () => {
  if (tickersHandlers.size === 0) return;

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribes = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribes, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;
