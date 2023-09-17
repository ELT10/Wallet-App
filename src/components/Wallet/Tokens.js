import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import "./css/tokens.css";
import dataVal from "../../data/Abis.json";

const TOKEN_ABI = dataVal.tokenabi;
const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);

export default function Tokens(props) {
  const { account, isActive, connector } = useWeb3React();
  const [tokenType, settokenType] = useState("...");
  const [tokenPrice, setTokenprice] = useState(0);
  const [tokenBalance, settokenBalance] = useState(0);
  const [tokenName, settokenName] = useState("...");
  const tokencontractInstance = new web3.eth.Contract(
    TOKEN_ABI,
    props.data.addr
  );

  function capitalize(str) {
    return str.toUpperCase();
  }
  useEffect(() => {
    getSummary();
  }, []);
  useEffect(() => {
    getSummary();
  }, [account]);

  useEffect(() => {
    if (tokenBalance !== 0 && tokenPrice !== 0) {
      props.updateTotalValue(parseFloat(tokenBalance) * parseFloat(tokenPrice));
    }
  }, [tokenPrice, tokenBalance]);

  async function getSummary() {
    if(localStorage.getItem("acct")){
    var typemn = capitalize(props.data.type);
    settokenType(typemn);
    await tokencontractInstance.methods
      .balanceOf(localStorage.getItem("acct"))
      .call()
      .then(
        (value) =>
          settokenBalance(noround(web3.utils.fromWei(value, "ether"), 3)) +
          getTkName()
      )
      .catch((error) => console.error(error));
  }
  async function getTkName() {
    await tokencontractInstance.methods
      .symbol()
      .call()
      .then((value) => settokenName(value) + getprice())
      .catch((error) => console.error(error));
  }
  function getprice() {
    if (props.data.type == "cbk") {
      setTokenprice(noround(1, 5));
    } else {
      const urlprice =
        "https://egold-marketdata.herokuapp.com/v1/summary/getTokenPrices/" +
        props.data.addr;
      fetch(urlprice)
        .then(function (response) {
          return response.json();
        })
        .then(function (prices) {
          var info = {};
          console.log("prices", props.data.type, prices);
          if ("price" in prices) {
            console.log("prices", props.data.type, prices.price);
            setTokenprice(noround(prices.price, 5));
          }
        });
    }
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
  function roundzeroes(val, x) {
    var float = parseFloat(val).toFixed(18);
    var num = float.toString();
    var n = num.slice(0, num.indexOf(".") + (x + 1));
    return n;
  }
  return (
    <div class="wallettokenrow">
      <div class="selectcurrowcontent">
        <div class="selectcurimgside">
          <div class="curicon">
            <img
              src={require("../../images/currency/" + props.data.type + ".svg")}
              style={{ width: "30px" }}
              class="img-fluid"
            />
          </div>
          <div class="curicondel">
            <p
              className="marginzero"
              style={{
                fontWeight: "500",
                gap: 8,
                display: "flex",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {tokenName}
              <span class="badge rounded-pill text-bg-secondary selectcurpricep beptewn">
                <p
                  className="marginzero"
                  style={{ textAlign: "center", fontSize: 10 }}
                >
                  BEP20
                </p>
              </span>
            </p>
            <p class="selectcurpricep marginzero ">${tokenPrice}</p>
          </div>
        </div>
        <div class="selectdetailside">
          <p class="selectcuramt marginzero">{tokenBalance}</p>
          <p class="selectcurpricep text-end marginzero">
            ${noround(tokenPrice * tokenBalance, 5)}
          </p>
        </div>
      </div>
    </div>
  );
}
