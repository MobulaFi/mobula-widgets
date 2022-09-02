import React, { useState, useEffect } from "react";
import moment from "moment";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import axiosInstance from "./../index";

const MARKET_STACK_QUOTE_URL = `${process.env.REACT_APP_MARKETSTACK_BASE_URL}/intraday`;
const MARKET_STACK_TICKER_URL = `${process.env.REACT_APP_MARKETSTACK_BASE_URL}/tickers`;

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
export function getTokenPercentage(status) {
  if (status == undefined) {
    try {
    } catch (err) {}
    return "-- ";
  }
  return status.toFixed(2);
}

function StockQuote(props) {
  const [tokens, setTokens] = useState([{}]);
  const pro = props.props.symbol;
  //   pro return "['SAFU','BTC','ETH']"
  console.log(pro);
  let tokenParse = JSON.parse(pro);
  console.log(props);

  const supabase = createClient(
    "https://ylcxvfbmqzwinymcjlnx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3h2ZmJtcXp3aW55bWNqbG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAyMTMxMzksImV4cCI6MTk3NTc4OTEzOX0.nuNpRLu2mWB5hvrJqwlishqGxfzm1qT2hPAXLCv6gNY"
  );

  useEffect(() => {
    supabase
      .from("assets")
      .select("symbol,price,logo,name,market_cap,price_change_24h,rank")
      .then((r) => {
        if (r.data) {
          let newArr = [];
          let filteredData;
          for (let i = 0; i < tokenParse.length; i++) {
            filteredData = r.data.filter(
              (entry) => entry.symbol === tokenParse[i]
            );
            newArr = [...newArr, filteredData[0]];
          }
          setTokens(newArr);
          console.log(tokens);
        }
      });
  }, []);

  return (
    <div className="container-block">
      {tokens?.map((token) => {
        return (
          <div className="box-price-block">
            <div>
              <img
                src={token.logo}
                alt={`${token.name} logo`}
                className="token-logo-block"
              />
              <p className="text-token-name-block">{token.name}</p>
              <p className="text-price-name-block">
                ${getTokenPrice(token.price)}
              </p>

              <p className="mobula-text">
                <span style={{ color: "var(--mobula)" }}>by</span> Mobula.fi
              </p>
            </div>
            <div
              className="percentage-box-block"
              style={{
                color:
                  token.price_change_24h < 0
                    ? "var(--red)"
                    : token.price_change_24h === 0
                    ? "var(--mobula)"
                    : "var(--green)",
                border:
                  token.price_change_24h < 0
                    ? "1px solid var(--red)"
                    : token.price_change_24h === 0
                    ? "var(--mobula)"
                    : "1px solid var(--green)",
              }}
            >
              {getTokenPercentage(token.price_change_24h)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StockQuote;
