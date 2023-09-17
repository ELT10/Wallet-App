import React, { useEffect, useState } from "react";
import "./css/wallet.css";
import BnbIcon from "../../images/currency/bnb.svg";
import { useNavigate } from "react-router-dom";
import dataVal from "../../data/Abis.json";
import { useWeb3React } from "@web3-react/core";
import LoaderCard from "../LoaderCard/LoaderCard";
import ConfirmCard from "../LoaderCard/ConfirmCard";
import ErrorCard from "../LoaderCard/ErrorCard";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import BackButton from "../Buttons/BackButton/BackButton";

const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);
const web3eth = new Web3("https://ethereum.publicnode.com");
const WBNB_ADDRESS = dataVal.wbnbtokencontract;
const WBNB_ABI = dataVal.wbnbAbi;

export default function ConvertToEth() {
  const history = useNavigate();
  const [userbnbBalance, setUserbnbbalance] = useState("0");
  const [userethBalance, setUserethbalance] = useState("0");
  const [bnbPrice, setbnbPrice] = useState("0");
  const [modalV, setmodalV] = useState(false);
  const [conversionAmnt, setconversionAmnt] = useState("");
  const [processState, setprocessState] = useState({
    state: "...",
    data: null,
  });
  const { account, isActive, connector } = useWeb3React();
  const toggleModal = () => {
    setmodalV(!modalV);
  };

  useEffect(() => {
    getSummary();
  }, []);

  async function getSummary() {
    if(localStorage.getItem("acct")){
    var xbal = await web3.eth.getBalance(localStorage.getItem("acct"));
    setUserbnbbalance(noround(web3.utils.fromWei(xbal, "ether"), 4));
    var xbaleth = await web3eth.eth.getBalance(localStorage.getItem("acct"));
    setUserethbalance(noround(web3.utils.fromWei(xbaleth, "ether"), 4));

    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("BNB RESPONSE", json);
        setbnbPrice(json.binancecoin.usd);
      })
      .catch((error) => {
        console.error(error);
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
      var x = noround(num, 3);
      return x; // if value < 1000, nothing to do
    }
  }

  //check if pool available
  const checkPool = async (asset) => {
    let poolsEndpoint = "https://thornode.ninerealms.com/thorchain/pools";

    let check = await fetch(poolsEndpoint, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(
          "ETH RESPONSE",
          json.find((obj) => obj.asset === asset)
        );
        if (json.find((obj) => obj.asset === asset).status == "Available") {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("chk", check);
    return check;
  };

  //get the quote
  const getSwapQuote = async () => {
    let swapEndPoint = "https://thornode.ninerealms.com/thorchain/quote/swap";
    let fromAsset = "BSC.BNB";
    let toAsset = "ETH.ETH";
    // let amount = web3.utils.toWei(conversionAmnt.toString(), "ether");
    let amount = 100000000 * conversionAmnt;
    let slippageTolerance_bps = 100;
    let qrequest = `${swapEndPoint}?amount=${amount}&from_asset=${fromAsset}&to_asset=${toAsset}&destination=${account}`;
    console.log("request=", qrequest);
    let quote = await fetch(qrequest, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Quote RESPONSE", json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
    return quote;
  };

  async function converttoeth() {
    const webb3 = new Web3(connector.provider);
    setprocessState({ state: "...", data: null });

    if (conversionAmnt > userbnbBalance) {
      setprocessState({ state: "error", data: "Insufficient balance" });
    } else {
      setprocessState({ state: "processing", data: null });
      let checker = await checkPool("BSC.BNB");
      console.log("checker", checker);
      if (checker) {
        let quote = await getSwapQuote();
        console.log("quote", quote);
        if (quote.error) {
          setprocessState({ state: "error", data: quote.error.toUpperCase() });
        } else {
          try {
            webb3.eth
              .sendTransaction({
                from: account,
                to: quote.inbound_address,
                value: web3.utils.toWei(conversionAmnt.toString(), "ether"),
                data: web3.utils.utf8ToHex(quote.memo),
              })
              .on("transactionHash", (hash) => {
                console.log(`Transaction Hash: ${hash}`);
              })
              .on("receipt", (receipt) => {
                console.log("Transaction Receipt:", receipt);
                setprocessState({
                  state: "done",
                  data: receipt.transactionHash,
                });
              })
              .on("error", (error) => {
                setprocessState({
                  state: "error",
                  data: JSON.stringify(error.message),
                });
                console.error("Transaction Error:", error);
              });
          } catch (e) {
            console.log(e);
            setprocessState({
              state: "error",
              data: JSON.stringify(e.message),
            });
          }
        }
      } else {
        console.log("Pool not avaiable right now");
      }
    }
  }

  return (
    <main>
      <div
        class="btn-color-primary mb20"
        style={{ cursor: "pointer" }}
        onClick={() => {
          toggleModal();
        }}
      >
        Convert BNB to ETH
      </div>
      <Modal
        isOpen={modalV}
        toggle={toggleModal}
        size="sm"
        backdrop="static"
        backdropClassName="connectmodalbg"
        className="modalswap"
      >
        <ModalHeader
          toggle={toggleModal}
          style={{
            color: "black",
            padding: "0.8rem",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              color: "#000",
              // background: "#F5F5F5"
            }}
          >
            Convert BNB to ETH
          </div>
        </ModalHeader>
        <ModalBody
          style={{
            background: "#fff",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "5px",
          }}
        >
          <div
            style={{
              borderRadius: 8,
              background: "#E0E7EA",
              marginTop: 10,
              margin: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 14,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#4F6B75",
                }}
              >
                Your Balance
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#4F6B75",
                }}
              >
                {userbnbBalance} BNB ≈ ${noround(bnbPrice * userbnbBalance, 4)}
              </p>
            </div>
          </div>
          <div style={{ marginTop: 15, padding: "1rem" }}>
            <label
              for="conversionamnmt"
              style={{ fontSize: 14, fontWeight: "400", color: "#4F6B75" }}
              class="form-label"
            >
              Conversion Amount
            </label>
            <div style={{ marginBottom: 40 }}>
              <InputGroup>
                <Input
                  className="withdrawinput"
                  type="text"
                  name="amount"
                  value={conversionAmnt}
                  id="pw"
                  style={{
                    backgroundColor: "#fff",
                    border: " 0.489247px solid rgba(0, 0, 0, 0.3)",
                    borderRight: "0px",
                    color: "#000",
                    fontSize: "13px",
                    padding: "13px 12px",
                    borderRadius: "4px 0px 0px 4px",
                  }}
                  onChange={(amount) => {
                    setconversionAmnt(amount.target.value);
                  }}
                />
                <span className="bnbconversion">BNB</span>
                <InputGroupText
                  className="withdrawspan"
                  style={{
                    "text-transform": "uppercase",
                    "background-color": "#4F6B75",
                    border: "0.489247px solid rgb(137 137 137 / 30%)",
                    "font-weight": "500",
                    cursor: "pointer",
                    color: "#FFC727",
                    marginLeft: "0px",
                    fontSize: 13,
                  }}
                  onClick={(e) => setconversionAmnt(userbnbBalance)}
                >
                  MAX
                </InputGroupText>
              </InputGroup>
              <p
                style={{
                  color: "#4F6B75",
                  fontSize: 12,
                  marginTop: 5,
                  right: 20,
                  position: "absolute",
                }}
              >
                {conversionAmnt} BNB ≈ ${noround(bnbPrice * conversionAmnt, 4)}
              </p>
            </div>

            <a
              class="btn-color-primary mb20"
              onClick={() => {
                converttoeth();
              }}
            >
              Convert
            </a>
            {processState.state == "..." ? (
              ""
            ) : processState.state == "processing" ? (
              <LoaderCard />
            ) : processState.state == "done" ? (
              <div className="convertsionbox">
                <ConfirmCard tx={processState.data} />
              </div>
            ) : (
              <div className="convertsionbox">
                <ErrorCard err={processState.data} />
              </div>
            )}
          </div>
          <div class="lightblue-bg secpadding brblr">
            <p class="text1" style={{ color: "#253237", fontSize: 12 }}>
              All conversions from BNB(BSC) to ETH are done using Thorchain.
              You'll receive native eth in the wallet from which you're sending
              this transaction. Just switch the network to ethereum to view the
              balance.
            </p>
          </div>
        </ModalBody>
      </Modal>
    </main>
  );
}
