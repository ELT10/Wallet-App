import React, { useEffect, useState } from "react";
import "./css/send.css";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import dataVal from "../../data/Abis.json";
import LoaderCard from "../LoaderCard/LoaderCard";
import ConfirmCard from "../LoaderCard/ConfirmCard";
import ErrorCard from "../LoaderCard/ErrorCard";
import { useWeb3React } from "@web3-react/core";
import BackButton from "../Buttons/BackButton/BackButton";
import { FaRegPaste } from "react-icons/fa6";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";

const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);
const EGOLD_ADDRESS = dataVal.egoldtokencontract;
const BUSD_ADDRESS = dataVal.busdtokencontract;
const CBK_ADDRESS = dataVal.cbktokencontract;
const WBNB_ADDRESS = dataVal.wbnbtokencontract;
const TOKEN_ABI = dataVal.tokenabi;

export default function Send() {
  const location = useLocation();
  console.log("locationsss", location);
  const { account, isActive, connector } = useWeb3React();

  const [sendToken, setsendToken] = useState("bnb");
  const [sendValue, setsendValue] = useState("");
  const [receiverAddr, setreceiverAddr] = useState("");
  const [tokenBalance, settokenbalance] = useState("0");
  const [tokenPrice, settokenPrice] = useState("0");
  const [processState, setprocessState] = useState({
    state: "...",
    data: null,
  });

  const tokens = [BUSD_ADDRESS, EGOLD_ADDRESS, WBNB_ADDRESS, CBK_ADDRESS];

  useEffect(() => {
    setsendToken(location.state);
    if (location.state == "bnb") {
      getBnbBalance();
    } else {
      getTokenBalances(location.state);
    }
  }, []);

  async function getBnbBalance() {
    var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
    settokenbalance(noround(web3.utils.fromWei(xbal, "ether"), 3));
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("BNB RESPONSE", json);
        settokenPrice(json.binancecoin.usd);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async function getTokenBalances(addr) {
    setsendToken(addr);
    if (addr == "bnb") {
      getBnbBalance();
    } else {
      var tokenAddr = "";
      if (addr == "egold") {
        tokenAddr = EGOLD_ADDRESS;
      } else if (addr == "busd") {
        tokenAddr = BUSD_ADDRESS;
      } else if (addr == "wbnb") {
        tokenAddr = WBNB_ADDRESS;
      } else if (addr == "cbk") {
        tokenAddr = CBK_ADDRESS;
      }
      const tokencontractInstance = new web3.eth.Contract(TOKEN_ABI, tokenAddr);
      await tokencontractInstance.methods
        .balanceOf(localStorage.getItem("acct"))
        .call()
        .then((value) =>
          settokenbalance(noround(web3.utils.fromWei(value, "ether"), 3))
        )
        .catch((error) => console.error(error));
      if (addr == "cbk") {
        settokenPrice(noround(1, 5));
      } else {
        const urlprice =
          "https://egold-marketdata.herokuapp.com/v1/summary/getTokenPrices/" +
          tokenAddr;
        fetch(urlprice)
          .then(function (response) {
            return response.json();
          })
          .then(function (prices) {
            var info = {};
            if ("price" in prices) {
              settokenPrice(noround(prices.price, 5));
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
  //to round decimal points with zeroes
  function roundzeroes(val, x) {
    var float = parseFloat(val).toFixed(18);
    var num = float.toString();
    var n = num.slice(0, num.indexOf(".") + (x + 1));
    return n;
  }
  async function transferToken() {
    setprocessState({ state: "processing", data: null });
    if (sendValue == "" && receiverAddr == "") {
      setprocessState({
        state: "error",
        data: "Receiver address and amount not provided",
      });
    }
    else if (receiverAddr == "") {
      setprocessState({
        state: "error",
        data: "No receiver address provided",
      });
    } else if (sendValue == "") {
      setprocessState({
        state: "error",
        data: "No amount provided",
      });
    }
    else {
      if (!web3.utils.isAddress(receiverAddr)) {
        setprocessState({
          state: "error",
          data: "Invalid Referral Address",
        });
      } else if (parseFloat(sendValue) > parseFloat(tokenBalance)) {
        setprocessState({
          state: "error",
          data: "Insufficient balance",
        });
      } else {
        const webb3 = new Web3(connector.provider);

        if (sendToken == "bnb") {
          let gaspri = await webb3.eth.getGasPrice();

          webb3.eth
            .sendTransaction({
              from: account,
              to: receiverAddr,
              value: web3.utils.toWei(sendValue.toString(), "ether"),
            })
            .on("transactionHash", (hash) => {
              console.log(`Transaction Hash: ${hash}`);
            })
            .on("receipt", (receipt) => {
              console.log("Transaction Receipt:", receipt);
              setprocessState({ state: "done", data: receipt.transactionHash });
                getBnbBalance();
            })
            .on("error", (error) => {
              setprocessState({ state: "error", data: JSON.stringify(error) });
              console.error("Transaction Error:", error);
            });
        } else {
          var SEND_TOKEN_ADDR = "";
          if (sendToken == "egold") {
            SEND_TOKEN_ADDR = EGOLD_ADDRESS;
          } else if (sendToken == "busd") {
            SEND_TOKEN_ADDR = BUSD_ADDRESS;
          } else if (sendToken == "cbk") {
            SEND_TOKEN_ADDR = CBK_ADDRESS;
          } else if (sendToken == "wbnb") {
            SEND_TOKEN_ADDR = WBNB_ADDRESS;
          }
          const sendInstance = new webb3.eth.Contract(TOKEN_ABI, SEND_TOKEN_ADDR);
          try {
            await sendInstance.methods
              .transfer(
                receiverAddr,
                web3.utils.toWei(sendValue.toString(), "ether")
              )
              .send({ from: account })
              .on("receipt", async function (fres) {
                setprocessState({ state: "done", data: fres.transactionHash });
                  getTokenBalances(location.state);
              })
              .on("error", function (error) {
                console.log("error", JSON.stringify(error.message));
                setprocessState({
                  state: "error",
                  data: JSON.stringify(error.message),
                });
              });
          } catch (e) {
            console.log(e);
            setprocessState({ state: "error", data: JSON.stringify(e.message) });
          }
        }
      }
    }


  }
  return (
    <div>
      <main>
        <div class="mainsection">
          <div class="tabsec secpadding lightgrey-bg brtlr">
            <BackButton Title="Send" ReRoute="wallet" />

            <select
              value={sendToken}
              class="form-select darksec-bg text-white mb20"
              aria-label="Default select example"
              onChange={(e) => {
                getTokenBalances(e.target.value);
              }}
            >
              <option value="bnb" defaultChecked>
                BNB - BEP20
              </option>
              <option value="egold">EGOLD</option>
              <option value="busd">BUSD</option>
              <option value="wbnb">WBNB</option>
              <option value="cbk">CBK</option>
            </select>

            <div class="mb-3">
              <label for="receiver_address" class="form-label">
                Receiver Address
              </label>
              <InputGroup>
                <Input
                  className="withdrawinput"
                  type="text"
                  name="receiver_address"
                  value={receiverAddr}
                  id="receiver_address"
                  style={{
                    backgroundColor: "#fff",
                    borderRight: "0px",
                    color: "#000",
                    fontSize: "13px",
                    padding: "13px 12px",
                    borderRadius: "8px 0px 0px 8px",
                    border: "1px solid #E2E8F0",
                    borderRightColor: "#fff",
                  }}
                  onChange={(e) => {
                    setreceiverAddr(e.target.value);
                  }}
                />

                <InputGroupText
                  className="pastespan"
                  onClick={async () => {
                    setreceiverAddr(await navigator.clipboard.readText());
                  }}
                >
                  <FaRegPaste color="#4F6B75" size={23} />
                </InputGroupText>
              </InputGroup>

              {/* 
              <input
                type="email"
                class="form-control"
                id="receiver_address"
                value={receiverAddr}
                onChange={(e) => {
                  setreceiverAddr(e.target.value);
                }}
              /> */}
            </div>
            <div class="mb-3">
              <label for="bnb_amount" class="form-label">
                {String(sendToken).toUpperCase()} Amount
              </label>
              <InputGroup>
                <Input
                  className="withdrawinput"
                  type="text"
                  name="amount"
                  value={sendValue}
                  id="amnt"
                  style={{
                    backgroundColor: "#fff",
                    borderRight: "0px",
                    color: "#000",
                    fontSize: "13px",
                    padding: "13px 12px",
                    borderRadius: "8px 0px 0px 8px",
                    border: "1px solid #E2E8F0",
                    borderRightColor: "#fff",
                  }}
                  onChange={(e) => {
                    setsendValue(e.target.value);
                  }}
                />
                <span
                  style={{
                    padding: 10,
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    color: "#253237",
                  }}
                >
                  {String(sendToken).toUpperCase()}
                </span>
                <InputGroupText
                  className="maxpan"
                  onClick={() => {
                    setsendValue(tokenBalance);
                  }}
                >
                  MAX
                </InputGroupText>
              </InputGroup>

              <p class="text-end" style={{ marginTop: 8,color:"#4F6B75",fontSize:"14px" }}>
                Available balance: {tokenBalance}{" "}
                {String(sendToken).toUpperCase()}
              </p>
            </div>
            {/* <p class="inputdetailp mb15">
              Network Fee <span class="float-end">... BNB ≈ $...</span>
            </p> */}
            <p class="inputdetailp mb20">
              Max total
              <span class="float-end">
                {sendValue == "" ? "0.00" : sendValue} ≈ $

                {sendValue == "" ? "0.00" : noround(parseFloat(sendValue) * parseFloat(tokenPrice), 4)}
              </span>
            </p>
            <a
              class="btn-color-primary"
              style={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => {
                transferToken();
              }}
            >
              Send
            </a>
            <div style={{ marginTop: 20 }}>
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
          </div>

          <div class="lightblue-bg secpadding brblr mb20">
            <p class="text1">
              Please provide wallet address to which you wish to transfer funds
              to.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
