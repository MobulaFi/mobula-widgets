import React, { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { getTokenPrice, formatBigAmount } from "../../utils/formater.tsx";

export function formatAmount(amount) {
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getTokenPrice(price) {
  if (price) {
    //Making sure we're getting a number without e-7 etc..
    price = parseFloat(String(price)).toFixed(
      String(price).includes("-")
        ? parseInt(String(price).split("-")[1]) + 2
        : String(price).split(".")[1]?.length || 0
    );

    if (parseFloat(price) > 1000) {
      return formatAmount(parseInt(price)).slice(0, 6);
    } else if (parseFloat(price) < 0.0001) {
      const exp = price.match(/0\.0+[1-9]/)?.[0] || "";
      return (
        price.split(".")[0] +
        ".0..0" +
        price.split(exp.slice(0, exp.length - 2))[1].slice(1, 8)
      );
    } else {
      return price.slice(0, 6);
    }
  } else if (isNaN(price)) {
    return <>{"--"}</>;
  } else {
    return 0;
  }
}

export function formatBigAmount(amount, precision = 3) {
  // @ts-ignore
  amount = formatAmount(parseInt(amount));
  let letter;
  switch (amount.split(",").length) {
    case 1:
      letter = "";
      break;
    case 2:
      letter = "k";
      break;
    case 3:
      letter = "M";
      break;
    case 4:
      letter = "B";
      break;
    case 5:
      letter = "T";
      break;
    case 6:
      letter = "Z";
      break;
  }

  if (precision) {
    return (
      amount.split(",")[0] +
      "." +
      amount
        .split(",")
        .slice(1)
        .join("")
        .slice(0, precision - amount.split(",")[0].length) +
      letter
    );
  } else {
    return amount.split(",")[0] + letter;
  }
}

export default function CoinTicker(props) {
  const [tokens, setTokens] = useState([{}]);

  console.log(props);

  useEffect(() => {
    const supabase = createClient(
      "https://ylcxvfbmqzwinymcjlnx.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3h2ZmJtcXp3aW55bWNqbG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyMTMxMzksImV4cCI6MTk3NTc4OTEzOX0.nuNpRLu2mWB5hvrJqwlishqGxfzm1qT2hPAXLCv6gNY"
    );
    supabase
      .from("assets")
      .select("*")
      .filter("symbol", "eq", props.props.symbol)
      .then((r) => {
        if (r.data) {
          console.log(r.data);
          setTokens(r.data);
        }
      });
  }, []);

  return (
    <div className="container">
      <div className="info-box">
        <img src={tokens[0].logo} alt="logo" className="logo" />
        <div className="token-name-container">
          <p className="token-name">
            {tokens[0].name + " " + `(${tokens[0].symbol})`}
          </p>
          <p className="token-price">
            {getTokenPrice(tokens[0].price)}
            <span className="span-fiat">USD</span>
            <span className="span-percentage">(-0.35%)</span>
          </p>
        </div>
      </div>
      <div className="row-flex">
        <div className="rank-box padding-box">
          <p className="white-600">Rank</p>
          <p className="amount">{tokens[0].rank}</p>
        </div>
        <div className="market-box column-flex padding-box">
          <p className="white-600">Market Cap</p>
          <p className="amount">
            ${formatBigAmount(tokens[0].market_cap) + " "}{" "}
            <span className="span-fiat amount-size">USD</span>
          </p>
        </div>
        <div className="volume-box column-flex padding-box">
          <p className="white-600">Volume</p>
          <p className="amount">
            ${formatBigAmount(tokens[0].volume) + " "}{" "}
            <span className="span-fiat amount-size">USD</span>
          </p>
        </div>
      </div>
      <div className="row-flex padding-powered">
        <img
          src="https://mobula.fi/WhiteRound.png"
          className="mobula-logo"
          alt="mobula-logo"
        />
        <p className="powered">Powered by Mobula.fi</p>
      </div>
    </div>
  );
}
