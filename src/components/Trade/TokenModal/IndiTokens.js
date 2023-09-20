import React, { useEffect, useState } from "react";
import dataVal from "../../../data/Abis.json";

export default function IndiToken(props) {
  const Web3 = require("web3");
  const web3 = new Web3(process.env.REACT_APP_RPC);

  const [tokenPrice, setTokenprice] = useState(0);
  const [tokenBalance, settokenBalance] = useState(0);

  const tokencontractInstance = new web3.eth.Contract(
    dataVal.tokenabi,
    props.datatok.find((item) => item.label == props.token).tokencontract
  );

  useEffect(() => {
    getSummary();
  }, []);

  async function getSummary() {
    if (props.name == "BNB") {
      var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
      settokenBalance(noround(web3.utils.fromWei(xbal, "ether"), 4));
      getprice()
    } else {
      await tokencontractInstance.methods
        .balanceOf(localStorage.getItem("acct"))
        .call()
        .then(
          (value) =>
            settokenBalance(noround(web3.utils.fromWei(value, "ether"), 3)) +
            getprice()
        )
        .catch((error) => console.error(error));
    }
  }

  function getprice() {
    console.log("ind gerer 222");
    if (props.token == "CBK") {
      setTokenprice(noround(1, 5));
    } else {
      const urlprice =
        "https://egold-marketdata.herokuapp.com/v1/summary/getTokenPrices/" +
        props.datatok.find((item) => item.label == props.token).tokencontract;
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
    <div
      class="walletrow"
      style={props.first == "true" ? { marginTop: "0px",cursor:"pointer" } : {cursor:"pointer"}}
      onClick={()=>props.name=="WBNB" ? props.updateParentValue("WBNB") : props.updateParentValue(props.token)}
    >
      <div class="walletrowimgsec">
        <div class="walletrowimg" style={{ display: "flex" }}>
          <span
            className={
              props.datatok.find((item) => item.label == props.token).icon
            }
          ></span>
        </div>
        <p class="walletrowimgp">{props.name}</p>
        <p class="walletbadge">BEP20</p>
      </div>

      <div class="walletpingsec">
        <div class="walletpingdel">
          <p class="walletpingp">{tokenBalance}</p>
          <p class="walletpingdelprice">
            ${noround(tokenPrice * tokenBalance, 3)}
          </p>
        </div>
      </div>
    </div>
  );
}
