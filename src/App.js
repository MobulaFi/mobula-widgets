import React from "react";
import StockQuote from "./components/StockQuote";
import CoinTicker from "./components/CoinTicker";
import CoinPrice from "./components/CoinPrice";

function App(props) {
  return (
    <div>
      {props.type === "CoinTicker" ? (
        <CoinTicker props={props} />
      ) : props.type === "CoinPrice" ? (
        <CoinPrice props={props} />
      ) : (
        <StockQuote props={props} />
      )}
    </div>
  );
}

export default App;
