import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";

export default function TradeData(props) {
  const [marketstate, setMarketstate] = useState({ data: null, loading: true });
  const [tradeData, setTradeData] = useState({ data: null, loading: true });
  const [trtype, setTrtype] = useState(0);


  useEffect(() => {
    fetchTableData();
  }, []);

  //To get latest trades on load
  function fetchTableData() {
    //To get latest trades onload
    const urltrade =
      "https://egold-marketdata.herokuapp.com/v1/summary/getLatestTrades/20";
    fetch(urltrade)
      .then((data) => data.json())
      .then((obj) =>
        Object.keys(obj).map((key) => {
          let newData = obj[key];
          newData.key = key;
          return newData;
        })
      )
      .then((newData) => setTradeData({ data: newData, loading: false }))
      .catch(function (error) {
        console.log(error);
      });
    const marketurl =
      "https://egold-marketdata.herokuapp.com/v1/summary/get24MarketStat";

    //fetch 24 hour market data
    fetch(marketurl)
      .then((data) => data.json())
      .then((obj) =>
        Object.keys(obj).map((key) => {
          let newData = obj[key];
          newData.key = key;
          return newData;
        })
      )
      .then((newData) => setMarketstate({ data: newData, loading: false }))
      .catch(function (error) {
        console.log(error);
      });
  }

  //To get latest trades or user transactions trade data on button click
  function handleTtype(x) {
    if (x == 0) {
      setTrtype(0);
      setTradeData({ loading: true });
      const url =
        "https://egold-marketdata.herokuapp.com/v1/summary/getLatestTrades/20";
      //fetch trade data
      fetch(url)
        .then((data) => data.json())
        .then((obj) =>
          Object.keys(obj).map((key) => {
            let newData = obj[key];
            newData.key = key;
            return newData;
          })
        )
        .then((newData) => setTradeData({ data: newData, loading: false }))
        .catch(function (error) {
          console.log(error);
        });
      localStorage.setItem("ttype", 0);
    } else {
      setTrtype(1);
      setTradeData({ loading: true });
      const url =
        "https://egold-marketdata.herokuapp.com/v1/summary/getLatestTrades/20/" +
        localStorage.getItem("acct");

      //fetch trade data
      fetch(url)
        .then((data) => data.json())
        .then((obj) =>
          Object.keys(obj).map((key) => {
            let newData = obj[key];
            newData.key = key;
            return newData;
          })
        )
        .then((newData) => setTradeData({ data: newData, loading: false }))
        .catch(function (error) {
          console.log(error);
        });
      localStorage.setItem("ttype", 1);
    }
  }

  function noround(number, decimalDigits) {
    const powerOfTen = Math.pow(10, decimalDigits);
    const formattedNumber = Math.floor(number * powerOfTen) / powerOfTen;
    if (Number.isInteger(formattedNumber)) {
      return roundzeroes(formattedNumber, 2);
    } else return formattedNumber;
  }

  //to round decimal points with zeroes
  function roundzeroes(val, x) {
    var float = parseFloat(val).toFixed(18);
    var num = float.toString();
    var n = num.slice(0, num.indexOf(".") + (x + 1));
    return n;
  }
  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num < 1000) {
      var x = noround(num, 2);
      return x; // if value < 1000, nothing to do
    }
  }

  return (
    <div class="detailCard secpadding mb20">
      <div class="volhour mb20">
        <p class="volhourp  mb10">Vol 24 Hours</p>
        <p class="volhourp fw700">
          {marketstate.loading
            ? "......."
            : numFormatter(
                parseFloat(marketstate.data[0].tagvol_tag).toFixed(4)
              ) +
              " EGOLD / " +
              numFormatter(
                parseFloat(marketstate.data[0].tagvol_usd).toFixed(4)
              ) +
              " BUSD"}
        </p>
      </div>
      <div class="wallettabsec latesttradesec brtlr">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              className={
                trtype
                  ? "nav-link typetabbtn brltb "
                  : "nav-link typetabbtn brltb active "
              }
              onClick={() => handleTtype(0)}
            >
              latest Trade
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              className={
                trtype
                  ? 
                  "nav-link typetabbtn brrtb active " :"nav-link typetabbtn brrtb "
              }
              onClick={() => handleTtype(1)}
            >
              Your Trades
            </button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-latesttrade"
            role="tabpanel"
            aria-labelledby="pills-latesttrade-tab"
            tabindex="0"
          >
            <div class="latesttradetable table-responsive">
              <table class="table table-bordered text-center">
                <thead>
                  <tr class="darktrbg text-white">
                    <th>Quantity (EGOLD)</th>
                    <th>Price (USD)</th>
                    <th>Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeData.loading ? (
                     <tr>
                     <td></td>
                     <td><Spinner /></td>
                     <td></td>
                   </tr>
                  ) : tradeData.data.length < 1 ? (
                    <tr>
                      <td></td>
                      <td>NO TRADE DATA</td>
                      <td></td>
                    </tr>
                  ) : (
                    Object.keys(tradeData.data).map((k, i) => {
                      let data = tradeData.data;
                      return data[i].type === "buy" ? (
                        <tr
                          class="lightgreenbg"
                          key={i}
                          onClick={() =>
                            window.open(
                              "https://bscscan.com/tx/" + data[i].txn,
                              "_blank"
                            )
                          }
                          style={{cursor:"pointer"}}
                        >
                          <td>
                            {" "}
                            {data[i].type === "buy"
                              ? parseFloat(data[i].tagVol).toFixed(4)
                              : data[i].toAsset == "BNB" ||
                                data[i].toAsset == "BUSD"
                              ? parseFloat(data[i].tagVol).toFixed(4)
                              : parseFloat(data[i].srcOut).toFixed(4) +
                                " " +
                                data[i].toAsset}
                          </td>
                          <td>
                            {" "}
                            {data[i].type == "sell" &&
                            data[i].toAsset !== "BNB" &&
                            data[i].toAsset !== "BUSD"
                              ? "$" +
                                parseFloat(
                                  data[i].tagUSDVol / data[i].srcOut
                                ).toFixed(4)
                              : "$" + parseFloat(data[i].TAG_USD).toFixed(4)}
                          </td>
                          <td>
                            {" "}
                            {"$" + parseFloat(data[i].tagUSDVol).toFixed(4)}
                          </td>
                        </tr>
                      ) : (
                        <tr
                          class="lightredbg"
                          key={i}
                          onClick={() =>
                            window.open(
                              "https://bscscan.com/tx/" + data[i].txn,
                              "_blank"
                            )
                          }
                          style={{cursor:"pointer"}}
                        >
                          <td>
                            {" "}
                            {data[i].type === "buy"
                              ? parseFloat(data[i].tagVol).toFixed(4)
                              : data[i].toAsset == "BNB" ||
                                data[i].toAsset == "BUSD"
                              ? parseFloat(data[i].tagVol).toFixed(4)
                              : parseFloat(data[i].srcOut).toFixed(4) +
                                " " +
                                data[i].toAsset}
                          </td>
                          <td>
                            {data[i].type == "sell" &&
                            data[i].toAsset !== "BNB" &&
                            data[i].toAsset !== "BUSD"
                              ? "$" +
                                parseFloat(
                                  data[i].tagUSDVol / data[i].srcOut
                                ).toFixed(4)
                              : "$" + parseFloat(data[i].TAG_USD).toFixed(4)}
                          </td>
                          <td>
                            {"$" + parseFloat(data[i].tagUSDVol).toFixed(4)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}
