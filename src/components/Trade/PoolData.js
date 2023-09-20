import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dataVal from "../../data/Abis.json";

export default function PoolData(props) {
  let navigate = useNavigate();
  const [fromLPBalance, setfromLPBalance] = useState(0.0);
  const [toLPBalance, settoLPBalance] = useState(0.0);
  const [FromperTo, setFromperTo] = useState("0.00000");
  const [ToperFrom, setToperFrom] = useState("0.00000");

  useEffect(() => {
    getSummary(props.from.tokencontract, props.to.tokencontract);
  }, []);

  useEffect(() => {
    getSummary(props.from.tokencontract, props.to.tokencontract);
  }, [props.from.tokencontract, props.to.tokencontract]);

  const getSummary = async (fromcontract, tocontract) => {
    const Web3 = require("web3");
    const web3 = new Web3(process.env.REACT_APP_RPC);

    const pancakeFactorycontractInstance = await new web3.eth.Contract(
      dataVal.pcfactoryabi,
      process.env.REACT_APP_PANCAKE_FACTORY_ADDR
    );

    const pancakeRouterInstance = new web3.eth.Contract(
      dataVal.pcrouterabi,
      process.env.REACT_APP_PANCAKE_ROUTER_ADDR
    );
    var oneToken = web3.utils.toWei("1", "ether");

    await pancakeRouterInstance.methods
      .getAmountsOut(oneToken, [fromcontract, tocontract])
      .call()
      .then((res) => {
          setFromperTo(parseFloat(web3.utils.fromWei(res[1])));
        
      });

    await pancakeRouterInstance.methods
      .getAmountsOut(oneToken, [tocontract, fromcontract])
      .call()
      .then((res) => {
          setToperFrom(parseFloat(web3.utils.fromWei(res[1])));
        
      });

    await pancakeFactorycontractInstance.methods
      .getPair(fromcontract, tocontract)
      .call()
      .then((res) => {
        const liquidityInstance = new web3.eth.Contract(
          dataVal.liquidityabi,
          res
        );
        liquidityInstance.methods
          .getReserves()
          .call()
          .then(async (res) => {
            await liquidityInstance.methods.token0()
            .call()
            .then((ress) => {
              if (ress == fromcontract) {
                setfromLPBalance(
                  numFormatter(
                    parseFloat(web3.utils.fromWei(res[0])).toFixed(4)
                  )
                );
                settoLPBalance(
                  numFormatter(
                    parseFloat(web3.utils.fromWei(res[1])).toFixed(4)
                  )
                );
              } else {
                setfromLPBalance(
                  numFormatter(
                    parseFloat(web3.utils.fromWei(res[1])).toFixed(4)
                  )
                );
                settoLPBalance(
                  numFormatter(
                    parseFloat(web3.utils.fromWei(res[0])).toFixed(4)
                  )
                );
              }
            });
          });
      });
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

  //To get first 3 non-zero digits(eg: 0.00000000123455 will return 0.00000000123)
  function getnonZero(num) {
    if (parseFloat(num) < 1 && parseFloat(num) > 0) {
      let numString = num.toString();
      numString = numString.replace(/^0+/, "");
      let nonZeroIndex = numString.search(/[1-9]/);
      if (nonZeroIndex === -1) {
        return "0";
      }

      let end = Math.min(nonZeroIndex + 4, numString.length);

      return "0" + numString.slice(0, end);
    } else {
      return noround(num, 3);
    }
  }

  return (
    <div class="detailCard secpadding mb20">
      <div class="swapdelrow brtlr bbff">
        <p>1 {props.from.label}</p>
        <p>
          {" "}
          {getnonZero(FromperTo)} {props.to.label}
        </p>
      </div>
      <div class="swapdelrow brblr mb20">
        <p>1 {props.to.label}</p>
        <p>
          {getnonZero(ToperFrom)} {props.from.label}
        </p>
      </div>
      <div class="swapdelrow brtlr bbff">
        <p>{props.from.label} in Pool</p>
        <p>
          {fromLPBalance} {props.from.label}
        </p>
      </div>
      <div class="swapdelrow brblr">
        <p>{props.to.label} in Pool</p>
        <p>
          {toLPBalance} {props.to.label}
        </p>
      </div>
    </div>
  );
}
