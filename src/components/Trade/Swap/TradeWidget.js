import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Spinner } from "reactstrap";
import LoaderCard from "../../LoaderCard/LoaderCard";
import ConfirmCard from "../../LoaderCard/ConfirmCard";
import ErrorCard from "../../LoaderCard/ErrorCard";
import dataVal from "../../../data/Abis.json";

import updown from "../../../images/updown.svg";
import PoolData from "../PoolData";
import TokenModal from "../TokenModal/TokenModal";

export default function TradeWidget(props) {
  const { account, isActive, connector } = useWeb3React();

  const Web3 = require("web3");
  const web3 = new Web3(process.env.REACT_APP_RPC);

  const datatok = [
    {
      id: 1,
      label: "BUSD",
      icon: "busdicon",
      tokencontract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    {
      id: 2,
      label: "BNB",
      icon: "bnbicon",
      tokencontract: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    {
      id: 3,
      label: "EGOLD",
      icon: "egoldicon",
      tokencontract: "0x8005D97E993668a528008d16338B42f9e976ED0F",
    },
    {
      id: 4,
      label: "WBNB",
      icon: "bnbicon",
      tokencontract: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    // {
    //   id: 5,
    //   label: "CBK",
    //   icon: "cbkicon",
    //   tokencontract: "0x14E3460453412Da9D4e635a4292eC95F360E5bF8",
    // },
  ];

  const [FromGlobal, setFromGlobal] = useState("BUSD");
  const [ToGlobal, setToGlobal] = useState("EGOLD");
  const [Fswapamnt, setFswapamnt] = useState(null);
  const [Tswapamnt, setTswapamnt] = useState(null);
  const [fromTokenBalance, setfromTokenBalance] = useState(0.0);
  const [toTokenBalance, settoTokenBalance] = useState(0);
  const [processState, setprocessState] = useState({
    state: "...",
    data: null,
  });
  const [loadapprove, setLoadapprove] = useState(false); //approve button loader

  const [rangevalue, setrangeValue] = useState(1);
  const [keyval, setkeyval] = useState(0);
  const [Tkeyval, setTkeyval] = useState(0);
  const [swapBtn, setswapBtn] = useState(true);

  //To update FromGlobal from modal
  const updateFromValue = (newValue) => {
    setFromGlobal(newValue);
  };

  //To update ToGlobal from modal
  const updateToValue = (newValue) => {
    setToGlobal(newValue);
  };

  useEffect(() => {
    if (isActive) {
      console.log("active");
      setFromGlobal("BUSD");
      setToGlobal("EGOLD");
      getSummary(
        datatok.find((item) => item.label == "BUSD").tokencontract,
        datatok.find((item) => item.label == "EGOLD").tokencontract
      );
    } else {
      setrangeValue(1);
      setFromGlobal("BUSD");
      setToGlobal("EGOLD");
      setFswapamnt(null);
      setTswapamnt(null);
      setfromTokenBalance(0.0);
      settoTokenBalance(0);
      getSummary(
        datatok.find((item) => item.label == "BUSD").tokencontract,
        datatok.find((item) => item.label == "EGOLD").tokencontract
      );
    }
  }, [account]);

  useEffect(() => {
    setFromGlobal("BUSD");
    setToGlobal("EGOLD");
    getSummary(
      datatok.find((item) => item.label == "BUSD").tokencontract,
      datatok.find((item) => item.label == "EGOLD").tokencontract
    );
  }, []);

  useEffect(() => {
    refreshState();
  }, [FromGlobal, ToGlobal]);

  useEffect(() => {
    getOnchangefrom(Fswapamnt);
  }, [FromGlobal]);

  useEffect(() => {
    getOnchangeto(Tswapamnt);
  }, [ToGlobal]);

  const getSummary = async (fromcontract, tocontract) => {
    if (FromGlobal !== "BNB") {
      var fromtokencontractInstance = await new web3.eth.Contract(
        dataVal.tokenabi,
        fromcontract
      );
    }
    if (ToGlobal !== "BNB") {
      var totokencontractInstance = await new web3.eth.Contract(
        dataVal.tokenabi,
        tocontract
      );
    }

    if (localStorage.getItem("acct") && account) {
      if (FromGlobal == "BNB") {
        var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
        setfromTokenBalance(noround(web3.utils.fromWei(xbal), 5));
      } else {
        await fromtokencontractInstance.methods
          .balanceOf(account)
          .call()
          .then((res) => {
            setfromTokenBalance(noround(web3.utils.fromWei(res), 3));
          });
      }
      if (ToGlobal == "BNB") {
        var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
        settoTokenBalance(noround(web3.utils.fromWei(xbal), 5));
      } else {
        await totokencontractInstance.methods
          .balanceOf(account)
          .call()
          .then((res) => {
            settoTokenBalance(noround(web3.utils.fromWei(res), 3));
          });
      }
    }
  };

  const refreshState = async () => {
    setprocessState({ state: "...", data: null });
    if (FromGlobal !== null)
      var fromcontract = datatok.find(
        (item) => item.label == FromGlobal
      ).tokencontract;
    if (ToGlobal !== null)
      var tocontract = datatok.find(
        (item) => item.label == ToGlobal
      ).tokencontract;

    if (FromGlobal !== "BNB" && FromGlobal !== null) {
      var fromtokencontractInstance = await new web3.eth.Contract(
        dataVal.tokenabi,
        fromcontract
      );
    }
    if (ToGlobal !== "BNB" && ToGlobal !== null) {
      var totokencontractInstance = await new web3.eth.Contract(
        dataVal.tokenabi,
        tocontract
      );
    }

    //these conditions are set to differentiate between bnb balance and other bep20 token balance
    if (localStorage.getItem("acct") && account) {
      if (FromGlobal !== null) {
        if (FromGlobal == "BNB") {
          var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
          setfromTokenBalance(noround(web3.utils.fromWei(xbal), 5));
        } else {
          await fromtokencontractInstance.methods
            .balanceOf(account)
            .call()
            .then((res) => {
              setfromTokenBalance(noround(web3.utils.fromWei(res), 3));
            });
        }
      } else {
        setFswapamnt("");
        setfromTokenBalance(0.0);
      }
      if (ToGlobal !== null) {
        if (ToGlobal == "BNB") {
          var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
          settoTokenBalance(noround(web3.utils.fromWei(xbal), 5));
        } else {
          await totokencontractInstance.methods
            .balanceOf(account)
            .call()
            .then((res) => {
              settoTokenBalance(noround(web3.utils.fromWei(res), 3));
            });
        }
      } else {
        setTswapamnt("");
        settoTokenBalance(0.0);
      }
    }
  };

  //to handle From input onchange
  const getOnchangefrom = async (value) => {
    setFswapamnt(value);
    if (value > 0) {
      if (
        (FromGlobal == "BNB" && ToGlobal == "WBNB") ||
        (FromGlobal == "WBNB" && ToGlobal == "BNB")
      ) {
        setTswapamnt(value);
      } else {
        const swapTokenval = new web3.eth.Contract(
          dataVal.pcrouterabi,
          process.env.REACT_APP_PANCAKE_ROUTER_ADDR
        );
        var weiToken = web3.utils.toWei(value.toString(), "ether");
        await swapTokenval.methods
          .getAmountsOut(weiToken, [
            datatok.find((item) => item.label == FromGlobal).tokencontract,
            datatok.find((item) => item.label == ToGlobal).tokencontract,
          ])
          .call()
          .then((res) => {
            setTswapamnt(parseFloat(web3.utils.fromWei(res[1])).toFixed(4));
          });
      }
    } else {
      setTswapamnt(0.0);
    }
  };

  //to handle To input onchange
  const getOnchangeto = async (value) => {
    setTswapamnt(value);
    if (value > 0) {
      if (
        (FromGlobal == "BNB" && ToGlobal == "WBNB") ||
        (FromGlobal == "WBNB" && ToGlobal == "BNB")
      ) {
        setFswapamnt(value);
      } else {
        const swapTokenval = new web3.eth.Contract(
          dataVal.pcrouterabi,
          process.env.REACT_APP_PANCAKE_ROUTER_ADDR
        );
        var weiToken = web3.utils.toWei(value.toString(), "ether");
        await swapTokenval.methods
          .getAmountsIn(weiToken, [
            datatok.find((item) => item.label == FromGlobal).tokencontract,
            datatok.find((item) => item.label == ToGlobal).tokencontract,
          ])
          .call(async function (err, res) {
            if (err) {
              console.log("An error occured", err);
              return;
            } else {
              console.log("xixi-", res);
              setFswapamnt(parseFloat(web3.utils.fromWei(res[0])).toFixed(4));
            }
          });
      }
    } else {
      setFswapamnt(0.0);
    }
  };

  //To interchage From and To tokens
  function interChangeToken(from, to) {
    console.log("interchaange--", from, to);
    setTswapamnt(0.0);
    setFswapamnt(0.0);
    setkeyval(keyval + 1);
    setTkeyval(Tkeyval + 1);
    setFromGlobal(to);
    setToGlobal(from);
  }

  //to Handle From MAX
  function getMaxF() {
    setFswapamnt(fromTokenBalance);
    getOnchangefrom(fromTokenBalance);
  }

  //to handle To MAX
  function getMaxT() {
    setTswapamnt(toTokenBalance);
    getOnchangeto(toTokenBalance);
  }

  function checkerror(err) {
    if (
      err.message ==
      "Please pass numbers as strings or BN objects to avoid precision errors." || err.message.includes("while converting number to string, invalid number value ")
    ) {
      setprocessState({
        state: "error",
        data: "Please provide a valid input",
      });
    } else if (JSON.stringify(err.message).includes("transaction underpriced"))
      setprocessState({
        state: "error",
        data: "Transaction was underpriced. Please try increasing the gas price",
      });
    else
      setprocessState({
        state: "error",
        data: JSON.stringify(err.message),
      });
  }


  //To approve From Token for swap
  async function approveToken() {
    try {
      if (localStorage.getItem("acct")) {
        setprocessState({ state: "...", data: null });
        setLoadapprove(true);
        const webb3 = new Web3(connector.provider);
        setswapBtn(true);
        const tokencontractInstance = await new webb3.eth.Contract(
          dataVal.tokenabi,
          datatok.find((item) => item.label == FromGlobal).tokencontract
        );

        await tokencontractInstance.methods
          .approve(
            process.env.REACT_APP_PANCAKE_ROUTER_ADDR,
            webb3.utils.toWei(Fswapamnt).toString()
          )
          .send({
            from: account,
          })
          .on("receipt", async function (res) {
            setLoadapprove(false);
            setswapBtn(false);
          })
          .on("error", function (error, receipt) {
            setLoadapprove(false);
            setswapBtn(true);
            console.log("error", error);
            checkerror(error);
          });
      }
    } catch (e) {
      console.log(e);
      setLoadapprove(false);
      checkerror(e);
    }
  }

  //To swap one token to another
  const swapToken = async (e) => {
    try {
      if (localStorage.getItem("acct")) {
        setprocessState({ state: "...", data: null });
        if (Fswapamnt > 0) {
          setprocessState({ state: "processing", data: null });
          const web3 = new Web3(connector.provider);
          const swapTokenInstance = new web3.eth.Contract(
            dataVal.pcrouterabi,
            process.env.REACT_APP_PANCAKE_ROUTER_ADDR
          );
          var today = new Date();
          var futureDate = new Date(today.getTime() + 60000);
          var Famount = String(Fswapamnt);

          var Tamount = parseFloat(((100 - rangevalue) / 100) * Tswapamnt)
            .toFixed(16)
            .toString();
          if (FromGlobal == "BNB" && ToGlobal == "WBNB") {
            convertbnbtowbnb();
          } else if (FromGlobal == "WBNB" && ToGlobal == "BNB") {
            convertwbnbtobnb();
          } else {
            if (FromGlobal == "BNB") {
              var method = swapTokenInstance.methods
                .swapExactETHForTokens(
                  web3.utils.toWei(Tamount),
                  [
                    datatok.find((item) => item.label == FromGlobal)
                      .tokencontract,
                    datatok.find((item) => item.label == ToGlobal).tokencontract,
                  ],
                  account,
                  futureDate.getTime()
                )
                .send({
                  from: account,
                  gasLimit: 200000,
                  gasPrice: web3.utils.toWei("10", "gwei"),
                  value: web3.utils.toWei(Famount),
                });
            } else if (ToGlobal == "BNB") {
              var method = swapTokenInstance.methods
                .swapExactTokensForETH(
                  web3.utils.toWei(Famount),
                  web3.utils.toWei(Tamount),
                  [
                    datatok.find((item) => item.label == FromGlobal)
                      .tokencontract,
                    datatok.find((item) => item.label == ToGlobal).tokencontract,
                  ],
                  account,
                  futureDate.getTime()
                )
                .send({
                  from: account,
                });
            } else {
              var method = swapTokenInstance.methods
                .swapExactTokensForTokens(
                  web3.utils.toWei(Famount),
                  web3.utils.toWei(Tamount),
                  [
                    datatok.find((item) => item.label == FromGlobal)
                      .tokencontract,
                    datatok.find((item) => item.label == ToGlobal).tokencontract,
                  ],
                  account,
                  futureDate.getTime()
                )
                .send({
                  from: account,
                });
            }
            await method
              .on("receipt", async function (cres) {
                setprocessState({ state: "done", data: cres.transactionHash });
                setswapBtn(true);
                getSummary(
                  datatok.find((item) => item.label == FromGlobal).tokencontract,
                  datatok.find((item) => item.label == ToGlobal).tokencontract
                );
                console.log("SWAPP SUCEESS");
              })
              .on("error", async function (e) {
                checkerror(e);
              });
          }
        } else {
          setprocessState({ state: "error", data: "Please provide a valid input" });
        }
      }

    } catch (e) {
      console.log(e);
      checkerror(e);
    }
  };

  async function convertbnbtowbnb() {
    const webb3 = new Web3(connector.provider);
    if (Fswapamnt > fromTokenBalance) {
      setprocessState({ state: "error", data: "Insufficient balance" });
    } else {
      const wbnbcontractInstance = new webb3.eth.Contract(
        dataVal.wbnbAbi,
        dataVal.wbnbtokencontract
      );
      setprocessState({ state: "processing", data: null });
      try {
        await wbnbcontractInstance.methods
          .deposit()
          .send({
            from: account,
            value: web3.utils.toWei(Fswapamnt.toString(), "ether"),
          })
          .on("receipt", async function (fres) {
            setprocessState({ state: "done", data: fres.transactionHash });
            getSummary(
              datatok.find((item) => item.label == FromGlobal).tokencontract,
              datatok.find((item) => item.label == ToGlobal).tokencontract
            );
          })
          .on("error", function (error) {
            console.log("error", JSON.stringify(error.message));
          });
      } catch (e) {
        console.log(e);
        setprocessState({ state: "error", data: JSON.stringify(e.message) });
      }
    }
  }
  async function convertwbnbtobnb() {
    const webb3 = new Web3(connector.provider);
    if (Fswapamnt > fromTokenBalance) {
      setprocessState({ state: "error", data: "Insufficient balance" });
    } else {
      const wbnbcontractInstance = new webb3.eth.Contract(
        dataVal.wbnbAbi, //wbnb contract
        dataVal.wbnbtokencontract
      );
      setprocessState({ state: "processing", data: null });
      try {
        await wbnbcontractInstance.methods
          .withdraw(web3.utils.toWei(Fswapamnt.toString(), "ether"))
          .send({
            from: account,
          })
          .on("receipt", async function (fres) {
            setprocessState({ state: "done", data: fres.transactionHash });
            getSummary(
              datatok.find((item) => item.label == FromGlobal).tokencontract,
              datatok.find((item) => item.label == ToGlobal).tokencontract
            );
          })
          .on("error", function (error) {
            console.log("error", JSON.stringify(error.message));
          });
      } catch (e) {
        console.log(e);
        setprocessState({ state: "error", data: JSON.stringify(e.message) });
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
    <>
      {/* {datatok.find((item) => item.label == FromGlobal).tokencontract ==
        datatok.find((item) => item.label == ToGlobal).tokencontract ? (
        ""
      ) : (
        <PoolData
          from={datatok.find((item) => item.label == FromGlobal)}
          to={datatok.find((item) => item.label == ToGlobal)}
        />
      )} */}
      <div class="detailCard secpadding mb20">
        <div class="fromreactangle pr mb20">
          <div class="p15">
            <p class="fs12 mb10">From</p>
            <p class="fromreactp">
              {" "}
              <input
                className="swapinput"
                placeholder="0.00"
                key={keyval}
                value={Fswapamnt}
                onChange={(e) => getOnchangefrom(e.target.value)}
              />
              <TokenModal
                currenttoken={FromGlobal}
                datatok={datatok}
                updateParentValue={updateFromValue}
              />
            </p>
            <p class="fs12">
              Balance: {FromGlobal == null ? "0.0" : fromTokenBalance}{" "}
              <span
                class="float-right yellowtext fs14"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => getMaxF()}
              >
                Use Max
              </span>
            </p>
          </div>
          <div
            class="updownimgb"
            style={{ cursor: "pointer" }}
            onClick={(e) => interChangeToken(FromGlobal, ToGlobal)}
          >
            <img src={updown} alt="" />
          </div>
        </div>
        <div class="fromreactangle mb20">
          <div class="p15">
            <p class="fs12 mb10">To</p>
            <p class="fromreactp">
              <input
                className="swapinput"
                placeholder="0.00"
                key={Tkeyval}
                value={Tswapamnt}
                onChange={(e) => getOnchangeto(e.target.value)}
              />
              <TokenModal
                currenttoken={ToGlobal}
                datatok={datatok}
                updateParentValue={updateToValue}
              />
            </p>
            <p class="fs12">
              Balance: {ToGlobal == null ? "0.0" : toTokenBalance}{" "}
              <span
                class="float-right yellowtext fs14"
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => getMaxT()}
              >
                Use Max
              </span>
            </p>
          </div>
        </div>
        <div class="fromreactangle p15 mb15">
          <div class="rangevalue mb15">
            <p>
              Set Slippage Tolerance: <span id="rangeValue">{rangevalue}</span>%{" "}
            </p>
          </div>
          <input
            class="customrange mb15"
            type="range"
            name=""
            min="1"
            max="100"
            value={rangevalue}
            onChange={(e) => {
              setrangeValue(e.target.value);
            }}
          />
          <div class="rangevalue">
            <p>
              Minimum Received:{" "}
              {isNaN(
                Number(Tswapamnt - (rangevalue / 100) * Tswapamnt).toFixed(4)
              )
                ? "0.0000"
                : Number(Tswapamnt - (rangevalue / 100) * Tswapamnt).toFixed(4)}
            </p>
          </div>
        </div>
        {FromGlobal !== "BNB" &&
          !(FromGlobal == "WBNB" && ToGlobal == "BNB") && (
            <button
              class="btn-color-primary"
              style={{
                cursor: "pointer",
                width: "100%",
                border: "0px",
                marginBottom: "10px",
              }}
              onClick={() => {
                approveToken();
              }}
              disabled={!swapBtn}
            >
              {loadapprove ? <Spinner size="sm" /> : "Approve Tokens"}
            </button>
          )}
        <button
          class="btn-color-primary"
          style={{ cursor: "pointer", width: "100%", border: "0px" }}
          onClick={() => {
            swapToken();
          }}
          disabled={
            (FromGlobal == "BNB" && ToGlobal !== null) ||
              (FromGlobal == "WBNB" && ToGlobal == "BNB")
              ? false
              : swapBtn
          }
        >
          Swap token
        </button>
        {processState.state == "..." ? (
          ""
        ) : processState.state == "processing" ? (
          <LoaderCard />
        ) : processState.state == "done" ? (
          <ConfirmCard tx={processState.data} />
        ) : (
          <ErrorCard err={processState.data} />
        )}
      </div>
    </>
  );
}
