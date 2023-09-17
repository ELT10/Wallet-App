import React, { useEffect, useState } from "react";
import "./css/wallet.css";
import BnbIcon from "../../images/currency/bnb.svg";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Token from "./Tokens";
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
import ConvertToEth from "./converttoEth";

const Web3 = require("web3");
const web3 = new Web3(process.env.REACT_APP_RPC);
const web3eth = new Web3("https://ethereum.publicnode.com");
const EGOLD_ADDRESS = dataVal.egoldtokencontract;
const BUSD_ADDRESS = dataVal.busdtokencontract;
const CBK_ADDRESS = dataVal.cbktokencontract;
const WBNB_ADDRESS = dataVal.wbnbtokencontract;
const WBNB_ABI = dataVal.wbnbAbi;

export default function Wallet() {
  const history = useNavigate();
  const [userbnbBalance, setUserbnbbalance] = useState("0");
  const [userethBalance, setUserethbalance] = useState("0");
  const [bnbPrice, setbnbPrice] = useState("0");
  const [ethPrice, setethPrice] = useState("0");
  const [modalV, setmodalV] = useState(false);
  const [conversionAmnt, setconversionAmnt] = useState("");
  const [totalBalance, settotalBalance] = useState(0);
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
  
  useEffect(() => {
    getSummary();
  }, [account]);

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
      const urleth =
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
      fetch(urleth, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("eth RESPONSE", json);
          setethPrice(json.ethereum.usd);
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

  async function convertwbnb() {
    const webb3 = new Web3(connector.provider);
    if (conversionAmnt > userbnbBalance) {
      setprocessState({ state: "error", data: "Insufficient balance" });
    } else {
      const wbnbcontractInstance = new webb3.eth.Contract(
        WBNB_ABI,
        WBNB_ADDRESS
      );
      setprocessState({ state: "processing", data: null });
      try {
        await wbnbcontractInstance.methods
          .deposit()
          .send({
            from: account,
            value: web3.utils.toWei(conversionAmnt.toString(), "ether"),
          })
          .on("receipt", async function (fres) {
            setprocessState({ state: "done", data: fres.transactionHash });
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

  const updateValue = (newValue) => {
    console.log("fn call!!!!", newValue);

    settotalBalance((totalBalance) => totalBalance + newValue);
  };

  return (
    <main>
      <div class="mainsection">
        <div class="tabsec secpadding lightgrey-bg brtlr">
          <div class="sendreceivesec darksec-bg mb20">
            <p class="walletamtp">
              $
              {numFormatter(
                noround(bnbPrice * userbnbBalance + totalBalance, 3)
              )}
            </p>
            <div class="selectcurbtnsec">
              <a
                onClick={() => {
                  history("/send", { state: "bnb" });
                }}
                class="btn-outline-color-secondary sendbtn"
              >
                Send
              </a>
              <a
                onClick={() => {
                  history("/receive", { state: "bnb" });
                }}
                class="btn-outline-color-secondary receivebtn"
              >
                Receive
              </a>
            </div>
          </div>
          <div class="wallettabsec lightgrey-bg brtlr">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li
                class="nav-item"
                role="presentation"
                style={{ width: "100%" }}
              >
                <button
                  class="nav-link typetabbtn active "
                  style={{ borderRadius: "8px" }}
                  id="pills-token-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-token"
                  type="button"
                  role="tab"
                  aria-controls="pills-token"
                  aria-selected="true"
                >
                  TOKEN
                </button>
              </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="pills-token"
                role="tabpanel"
                aria-labelledby="pills-token-tab"
                tabindex="0"
              >
                <div
                  class="wallettokenrow"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [
                        numFormatter(noround(userbnbBalance, 4)),
                        "bnb",
                        bnbPrice,
                      ],
                    });
                  }}
                >
                  <div class="selectcurrowcontent">
                    <div class="selectcurimgside">
                      <div class="curicon">
                        <img src={BnbIcon} class="img-fluid" />
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
                          ETH
                          <span class="badge rounded-pill text-bg-secondary selectcurpricep beptewn">
                            <p
                              className="marginzero"
                              style={{ textAlign: "center", fontSize: 10 }}
                            >
                              ERC20
                            </p>
                          </span>
                        </p>
                        <p class="selectcurpricep marginzero ">${ethPrice}</p>
                      </div>
                    </div>
                    <div class="selectdetailside">
                      <p class="selectcuramt marginzero">{userethBalance}</p>
                      <p class="selectcurpricep text-end marginzero">
                        ${noround(ethPrice * userethBalance, 5)}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="wallettokenrow"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [
                        numFormatter(noround(userbnbBalance, 4)),
                        "bnb",
                        bnbPrice,
                      ],
                    });
                  }}
                >
                  <div class="selectcurrowcontent">
                    <div class="selectcurimgside">
                      <div class="curicon">
                        <img src={BnbIcon} class="img-fluid" />
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
                          BNB
                          <span class="badge rounded-pill text-bg-secondary selectcurpricep beptewn">
                            <p
                              className="marginzero"
                              style={{ textAlign: "center", fontSize: 10 }}
                            >
                              BEP20
                            </p>
                          </span>
                        </p>
                        <p class="selectcurpricep marginzero ">${bnbPrice}</p>
                      </div>
                    </div>
                    <div class="selectdetailside">
                      <p class="selectcuramt marginzero">{userbnbBalance}</p>
                      <p class="selectcurpricep text-end marginzero">
                        ${noround(bnbPrice * userbnbBalance, 5)}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [WBNB_ADDRESS, "wbnb"],
                    });
                  }}
                >
                  <Token
                    data={{ type: "wbnb", addr: WBNB_ADDRESS }}
                    updateTotalValue={updateValue}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [BUSD_ADDRESS, "busd"],
                    });
                  }}
                >
                  <Token
                    data={{ type: "busd", addr: BUSD_ADDRESS }}
                    updateTotalValue={updateValue}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [EGOLD_ADDRESS, "egold"],
                    });
                  }}
                >
                  <Token
                    data={{ type: "egold", addr: EGOLD_ADDRESS }}
                    updateTotalValue={updateValue}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history("/selecttoken", {
                      state: [CBK_ADDRESS, "cbk"],
                    });
                  }}
                >
                  <Token
                    data={{ type: "cbk", addr: CBK_ADDRESS }}
                    updateTotalValue={updateValue}
                  />
                </div>

                <div
                  class="btn-color-primary mb20"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    toggleModal();
                  }}
                >
                  Convert BNB to WBNB
                </div>
                <ConvertToEth/>
              </div>
            </div>
          </div>
        </div>

        <div class="lightblue-bg secpadding brblr mb20">
          <p class="text1">
            The wallet displays the balance of various currencies in your wallet
            and their current market value in US Dollars. Additionally, it shows
            your ANFT holdings.
          </p>
        </div>
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
            Convert BNB to WBNB
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
                convertwbnb();
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
              All conversions from BNB to WBNB are executed on a 1:1 ratio.
              Please make sure you have sufficient BNB balance to pay various
              transaction fees on the network.
            </p>
          </div>
        </ModalBody>
      </Modal>
    </main>
  );
}
