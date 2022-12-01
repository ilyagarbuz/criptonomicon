const API_KEY =
  "73f8eac5b3e2b51b5a1e728a8b254f3367aca5551bc47a61a177ddd04dab5b0d";

export const loadTicker = (tickerName) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  ).then((r) => r.json());
