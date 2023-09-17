import React, { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import TokenBal from "./TokenBal";
import { useNavigate } from "react-router-dom";
const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);

export default function WalletCard() {
  const history = useNavigate();
  const [tokenBalance, setTokenBalance] = useState("....");

  useEffect(() => {
    getSummary();
    const interval = setInterval(async () =>{
      getSummary();
    }, 7000);
   
    return () => clearInterval(interval);
  }, []);

  const getSummary = async () => {
    var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
    setTokenBalance(noround(web3.utils.fromWei(xbal, "ether"), 3));
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
      <div class="walletamtsec mb20">
        <div class="darksec-bg secpadding brtlr">
          <div class="row">
            <div class="col-6 d-flex align-items-center">
              <p class=" text-white bnbvals">
                BNB <span class="fw700">{tokenBalance}</span>
              </p>
            </div>
            <div
              class="col-6"
              style={{ cursor: "pointer" }}
              onClick={() => {
                history("/wallet");
              }}
            >
              <div class="btn-bg-yellow">Wallet</div>
            </div>
          </div>
        </div>
        <div class="lightblue-bg secpadding brblr">
          <div class="d-flex justify-content-between">
            <TokenBal
              name="EGOLD"
              address="0x8005D97E993668a528008d16338B42f9e976ED0F"
            />
            <TokenBal
              name="BUSD"
              address="0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
            />
            <TokenBal
              name="WBNB"
              address="0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
            />
            <TokenBal
              name="CBK"
              address="0x14E3460453412Da9D4e635a4292eC95F360E5bF8"
            />
          </div>
        </div>
      </div>
    </>
  );
}
