import React, { useEffect, useState } from "react";
import dataVal from "../../data/Abis.json";

import { useWeb3React } from "@web3-react/core";

const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);
const TOKEN_ABI = dataVal.tokenabi;

export default function WalletCard(props) {
  const [tokenBalance, setTokenBalance] = useState("....");
  const tokencontractInstance = new web3.eth.Contract(TOKEN_ABI, props.address);

  useEffect(() => {
    getSummary();
    const interval = setInterval(async () =>{
      getSummary();
    }, 7000);
   
    return () => clearInterval(interval);
  }, []);


  const getSummary = async () => {
    await tokencontractInstance.methods
      .balanceOf(localStorage.getItem("acct"))
      .call()
      .then((value) =>
        setTokenBalance(noround(web3.utils.fromWei(value, "ether"), 3))
      )
      .catch((error) => console.error(error));
  };

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
    <>
      <div>
        <p class="walletsecp">{props.name}</p>
        <p class="walletsecp2">{tokenBalance}</p>
      </div>
    </>
  );
}
