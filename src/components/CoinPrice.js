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

export function getTokenPercentage(status) {
  if (status == undefined) {
    try {
    } catch (err) {}
    return "-- ";
  }
  return status.toFixed(2);
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

export default function CoinPrice(props) {
  const [tokens, setTokens] = useState([]);
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
          const rightToken = r.data.filter((entry) => entry.rank < 8);
          console.log(rightToken);
          setTokens(rightToken);
        }
      });
    console.log(tokens);
    if (tokens) {
    }
  }, []);

  return (
    <div className="container-price-marquee">
      <div className="powered-price-marquee">
        <img
          src="https://mobula.fi/WhiteRound.png"
          alt="Mobula logo"
          style={{ height: "44px", width: "44px", marginRight: "10px" }}
          className="mobula-logo-price-marquee"
        />
        <div className="powered-box-price-marquee">
          <p className="powered-text-price-marquee">Powered by</p>
          <p className="mobula-text-price-marquee">Mobula.fi</p>
        </div>
      </div>
      {tokens.map((token) => {
        return (
          <div className="between-price-marquee">
            <div className="left-price-marquee">
              <img
                src={token.logo}
                alt="Mobula logo"
                style={{ height: "35px", width: "35px", marginRight: "10px" }}
                className="mobula-logo-price-marquee"
              />
              <div className="powered-box-price-marquee">
                <p className="token-text-price-marquee">{token.name}</p>
                <p className="fiat-text-price-marquee">{token.symbol}</p>
              </div>
            </div>
            <div className="right-price-marquee">
              <p className="token-text-price-marquee">
                {getTokenPrice(token.price)}
              </p>
              <div className="price-token-price-marquee">
                <div
                  style={{
                    background:
                      token.price_change_24h < 0
                        ? "var(--red)"
                        : token.price_change_24h === 0
                        ? "var(--mobula)"
                        : "var(--green)",
                  }}
                  className="percentage-circle"
                ></div>
                <p
                  style={{
                    color:
                      token.price_change_24h < 0
                        ? "var(--red)"
                        : token.price_change_24h === 0
                        ? "var(--mobula)"
                        : "var(--green)",
                  }}
                  className="percentage-text-price-marquee"
                >
                  {getTokenPercentage(token.price_change_24h)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
