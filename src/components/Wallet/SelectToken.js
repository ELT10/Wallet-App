import React, { useState, useEffect } from "react";
import BackButton from "../Buttons/BackButton/BackButton";
import IMG from "../../images/currency/bnb.svg";
import { useNavigate, useLocation } from "react-router-dom";
import dataVal from "../../data/Abis.json";

const TOKEN_ABI = dataVal.tokenabi;
const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);

export default function SelectToken() {
  const location = useLocation();
  const history = useNavigate();

  const [tokenBalance, settokenBalance] = useState("...");
  const [tokenPrice, setTokenprice] = useState(0);

  useEffect(() => {
    if (location.state[1] == "bnb") {
      setTokenprice(location.state[2]);
      settokenBalance(location.state[0]);
    } else {
      getSummary();
    }
  }, []);

  async function getSummary() {
    const tokencontractInstance = new web3.eth.Contract(
      TOKEN_ABI,
      location.state[0]
    );
    await tokencontractInstance.methods
      .balanceOf(localStorage.getItem("acct"))
      .call()
      .then(
        (value) =>
          console.log("tokennns,sss", value) +
          settokenBalance(noround(web3.utils.fromWei(value, "ether"), 3)) +
          getprice()
      )
      .catch((error) => console.error(error));
  }

  function getprice() {
    if (location.state[1] == "cbk") {
      setTokenprice(1);
    } else {
      const urlprice =
        "https://egold-marketdata.herokuapp.com/v1/summary/getTokenPrices/" +
        location.state[0];
      fetch(urlprice)
        .then(function (response) {
          return response.json();
        })
        .then(function (prices) {
          if ("price" in prices) {
            setTokenprice(noround(prices.price, 5));
          }
        });
    }
  }
  //to not round values while showing balance
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
  return (
    <main>
      <div class="mainsection">
        <div class="tabsec secpadding lightgrey-bg brtlr">
          <BackButton
            Title={
              <>
                <img
                  style={{ height: 30 }}
                  src={require("../../images/currency/" +
                    location.state[1] +
                    ".svg")}
                />
                <p>{String(location.state[1]).toUpperCase()}</p>
                <span class="badge rounded-pill text-bg-secondary selectcurpricep beptewn-sel">
                  <p
                    className="marginzero"
                    style={{ textAlign: "center", fontSize: 10 }}
                  >
                    BEP20
                  </p>
                </span>
              </>
            }
            ReRoute="wallet"
          />
          <div
            class="sendreceivesec darksec-bg"
            style={{ marginTop: "30px", marginBottom: "8px" }}
          >
            <p class="walletamtp">
              {tokenBalance == "..." ? "..." : tokenBalance}
              <p
                style={{
                  fontSize: 20,
                  color: "#A7B5BA",
                }}
              >
                $
                {tokenBalance == "..." || tokenPrice == 0
                  ? "..."
                  : noround(tokenBalance * tokenPrice, 3)}
              </p>
            </p>

            <div class="selectcurbtnsec">
              <a
                onClick={() => {
                  history("/send", { state: location.state[1] });
                }}
                class="btn-outline-color-secondary sendbtn"
              >
                Send
              </a>
              <a
                onClick={() => {
                  history("/receive", { state: location.state[1] });
                }}
                class="btn-outline-color-secondary receivebtn"
              >
                Receive
              </a>
            </div>
          </div>
        </div>
        <div class="lightblue-bg secpadding brblr mb20">
          <p class="text1">
            Please choose one of two activities. Send or Receive.
          </p>
        </div>
      </div>
    </main>
  );
}
