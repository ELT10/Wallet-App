import React, { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BackButton from "./Buttons/BackButton/BackButton";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
export default function Calculator() {
  const history = useNavigate();
  const dailySupply = 6849.315068;
  const fiftydaySupply = 342465.7534;

  const [minerType, setMinerType] = useState("5");
  const [minerNumber, setMinerNumber] = useState(1);
  const [netHP, setNetHP] = useState("...");
  const [yourHP, setYourHP] = useState("...");
  const [miningPeriod, setMiningPeriod] = useState("...");

  const [ctax, setCtax] = useState(0);
  const [claimNum, setClaimNum] = useState("...");

  const [egPrice, setEgPrice] = useState("...");
  const [yourEarn, setYourEarn] = useState("...");
  const [dataopen, setDataOpen] = useState(true);
  const [tradestate, setTradestate] = useState({ data: null, loading: true });

  useEffect(() => {
    getSummary();
  }, []);

  const getSummary = async () => {
    const url = "https://egold-treasury.tagdev.info/v1/summary";

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (newData) {
        console.log("---", newData);
        setNetHP(newData.hashPowerSold);
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });

    const urltd =
      "https://egold-marketdata.herokuapp.com/v1/summary/getLatestTrades/20/";
    //fetch 24 hour market data
    fetch(urltd)
      .then(function (response) {
        return response.json();
      })
      .then(function (newData) {
        setEgPrice(parseFloat(newData[0].TAG_USD).toFixed(4));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function handleMinerType(e) {
    setMinerType(e.target.value);
    if (e.target.value == 1) setYourHP(20 * minerNumber);
    else if (e.target.value == 2) setYourHP(100 * minerNumber);
    else if (e.target.value == 3) setYourHP(500 * minerNumber);
    else if (e.target.value == 4) setYourHP(2500 * minerNumber);
    else if (e.target.value == 5) setYourHP(50 * minerNumber);
    else if (e.target.value == 6) setYourHP(250 * minerNumber);
    else if (e.target.value == 7) setYourHP(1250 * minerNumber);
    else if (e.target.value == 8) setYourHP(6250 * minerNumber);
    else if (e.target.value == 9) setYourHP(12500 * minerNumber);
    else setYourHP("...");
  }

  function handleMinerNumber(e) {
    setMinerNumber(e.target.value);
    if (minerType == 1) setYourHP(20 * e.target.value);
    else if (minerType == 2) setYourHP(100 * e.target.value);
    else if (minerType == 3) setYourHP(500 * minerNumber);
    else if (minerType == 4) setYourHP(2500 * e.target.value);
    else if (minerType == 5) setYourHP(50 * e.target.value);
    else if (minerType == 6) setYourHP(250 * e.target.value);
    else if (minerType == 7) setYourHP(1250 * e.target.value);
    else if (minerType == 8) setYourHP(6250 * e.target.value);
    else if (minerType == 9) setYourHP(12500 * e.target.value);
    else setYourHP("...");
  }

  function handleClaimNum(e) {
    setClaimNum(e.target.value);
    if (e.target.value > 0 && e.target.value < 11) {
      var tax = e.target.value * 5 - 5;
      setCtax(tax);
    }
  }

  return (
    <main>
      <div class="mainsection">
        <div
          class="tabsec secpadding lightgrey-bg"
          style={{ marginBottom: 30, borderRadius: 8 }}
        >
          <BackButton Title="Mining Calculator" ReRoute="" />
          <div class="mb20">
            <div
              className="calcwrap"
              style={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <div>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Select miner type
                </label>
                <select
                  class="form-select mb20"
                  aria-label="Default select example"
                  style={{ color: "#4f6b75", padding: 12 }}
                  value={minerType}
                  onChange={(e) => handleMinerType(e)}
                >
                  <option value="5">Egold Miner S1</option>
                  <option value="6">Egold Miner S2</option>
                  <option value="7">Egold Miner S3</option>
                  <option value="8">Egold Miner S4</option>
                  <option value="9">Egold Miner S5</option>
                  <option value="1">Egold Miner G1</option>
                  <option value="2">Egold Miner G2</option>
                  <option value="3">Egold Miner G3</option>
                  <option value="4">Egold Miner G4</option>
                </select>
              </div>
              <div style={{ marginTop: 20 }}>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Enter number of miners
                </label>
                <InputGroup>
                  <Input
                    className="withdrawinput"
                    type="text"
                    name="amount"
                    // value={conversionAmnt}
                    id="pw"
                    style={{
                      backgroundColor: "#fff",
                      border: " 0.489247px solid #dee2e6",

                      color: "#000",
                      fontSize: "13px",
                      padding: "13px 12px",
                      borderRadius: "8px",
                    }}
                    onChange={(e) => handleMinerNumber(e)}
                  />
                </InputGroup>
              </div>
              <div style={{ marginTop: 20 }}>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Network hashrate
                </label>
                <InputGroup>
                  <Input
                    className="withdrawinput"
                    type="text"
                    name="amount"
                    placeholder={netHP == "..." ? "" : netHP}
                    value={netHP == "..." ? "" : netHP}
                    id="pw"
                    style={{
                      backgroundColor: "#fff",
                      border: " 0.489247px solid #dee2e6",
                      borderRight: "0px",
                      color: "#000",
                      fontSize: "13px",
                      padding: "13px 12px",
                      borderRadius: "8px 0px 0px 8px",
                    }}
                    onChange={(e) => setNetHP(e.target.value)}
                  />

                  <InputGroupText
                    className="withdrawspan"
                    style={{
                      "text-transform": "uppercase",
                      "background-color": "#648795",
                      border: "0.489247px solid rgb(137 137 137 / 30%)",
                      "font-weight": "500",
                      cursor: "pointer",
                      color: "#FFC727",
                      marginLeft: "0px",
                      fontSize: 13,
                    }}
                  >
                    MHS
                  </InputGroupText>
                </InputGroup>
              </div>
              <div style={{ marginTop: 20 }}>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Mining period
                </label>
                <InputGroup>
                  <Input
                    className="withdrawinput"
                    type="text"
                    name="amount"
                    placeholder={miningPeriod == "..." ? "" : miningPeriod}
                    value={miningPeriod == "..." ? "" : miningPeriod}
                    id="pw"
                    style={{
                      backgroundColor: "#fff",
                      border: " 0.489247px solid #dee2e6",
                      borderRight: "0px",
                      color: "#000",
                      fontSize: "13px",
                      padding: "13px 12px",
                      borderRadius: "8px 0px 0px 8px",
                    }}
                    onChange={(e) => setMiningPeriod(e.target.value)}
                  />

                  <InputGroupText
                    className="withdrawspan"
                    style={{
                      "text-transform": "uppercase",
                      "background-color": "#648795",
                      border: "0.489247px solid rgb(137 137 137 / 30%)",
                      "font-weight": "500",
                      cursor: "pointer",
                      color: "#FFC727",
                      marginLeft: "0px",
                      fontSize: 13,
                    }}
                  >
                    DAYS
                  </InputGroupText>
                </InputGroup>
              </div>
              <div style={{ marginTop: 20 }}>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Claim count
                </label>
                <div style={{ display: "flex" }}>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    style={{ color: "#4f6b75", padding: 12,borderTopRightRadius:"0px",borderBottomRightRadius:"0px" }}
                    value={claimNum == "..." ? "" : claimNum}
                    onChange={(e) => handleClaimNum(e)}
                  >
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                    <option value={"6"}>6</option>
                    <option value={"7"}>7</option>
                    <option value={"8"}>8</option>
                    <option value={"9"}>9</option>
                    <option value={"10"}>10</option>
                  </select>
                  <div
                    style={{
                      "text-transform": "uppercase",
                      "background-color": "#648795",
                      border: "0.489247px solid rgb(137 137 137 / 30%)",
                      "font-weight": "500",
                      cursor: "pointer",
                      color: "#FFC727",
                      marginLeft: "0px",
                      fontSize: 13,
                      borderBottomRightRadius: ".25rem",
                      borderTopRightRadius: ".25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        width: 80,
                        textAlign: "center",
                      }}
                    >
                      Out of 10{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <label
                  for="downline_rank"
                  class="form-label"
                  style={{ color: "#2D3748", fontSize: 15 }}
                >
                  Egold Price
                </label>
                <InputGroup>
                  <Input
                    className="withdrawinput"
                    type="text"
                    name="amount"
                    id="pw"
                    style={{
                      backgroundColor: "#fff",
                      border: " 0.489247px solid #dee2e6",
                      borderRight: "0px",
                      color: "#000",
                      fontSize: "13px",
                      padding: "13px 12px",
                      borderRadius: "8px 0px 0px 8px",
                    }}
                    value={egPrice}
                    onChange={(e) => setEgPrice(e.target.value)}
                  />

                  <InputGroupText
                    className="withdrawspan"
                    style={{
                      "text-transform": "uppercase",
                      "background-color": "#648795",
                      border: "0.489247px solid rgb(137 137 137 / 30%)",
                      "font-weight": "500",
                      cursor: "pointer",
                      color: "#FFC727",
                      marginLeft: "0px",
                      fontSize: 13,
                    }}
                  >
                    BUSD
                  </InputGroupText>
                </InputGroup>
              </div>
            </div>

            <div
              style={{ marginTop: 20, background: "#fff", padding: 0 }}
              className="calcwrap"
            >
              <div
                style={{
                  background: "#648795",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  padding: 15,
                }}
              >
                <p style={{ margin: 0, color: "#fff", fontWeight: "400" }}>
                  Estimated EGOLD Yield
                </p>
              </div>
              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <div className="yeiddiv">
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Network hashrate
                  </span>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {netHP.toLocaleString()} MHS
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Your hashrate
                  </span>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {yourHP} MHS
                  </span>
                </div>
                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Share of network
                  </span>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {netHP == "..." || yourHP == "..."
                      ? "..."
                      : parseFloat((yourHP / netHP) * 100).toFixed(4)}{" "}
                    %
                  </span>
                </div>
                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Production {miningPeriod} days
                  </span>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {miningPeriod != "..."
                      ? parseFloat(dailySupply * miningPeriod).toFixed(3)
                      : "..."}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Your share
                  </span>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {netHP == "..." || yourHP == "..." || miningPeriod == "..."
                      ? "..."
                      : parseFloat(
                          (yourHP / netHP) * dailySupply * miningPeriod
                        ).toFixed(3)}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Mining fuel fee @ 50%
                  </span>
                  <span
                    style={{
                      color: "#FF0000",

                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {netHP == "..." || yourHP == "..." || miningPeriod == "..."
                      ? "..."
                      : "-" +
                        parseFloat(
                          0.5 * (yourHP / netHP) * dailySupply * miningPeriod
                        ).toFixed(3)}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Depreciation @0%
                  </span>
                  <span
                    style={{
                      color: "#FF0000",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {ctax == "..." ||
                    yourHP == "..." ||
                    netHP == "..." ||
                    miningPeriod == "..."
                      ? "..."
                      : "-" +
                        parseFloat(
                          (ctax / 100) *
                            (yourHP / netHP) *
                            dailySupply *
                            miningPeriod
                        ).toFixed(3)}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Warehouse fee @1%
                  </span>
                  <span
                    style={{
                      color: "#FF0000",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {netHP == "..." || yourHP == "..." || miningPeriod == "..."
                      ? "..."
                      : "-" +
                        parseFloat(
                          0.01 * (yourHP / netHP) * dailySupply * miningPeriod
                        ).toFixed(3)}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Net Egold mined
                  </span>
                  <span
                    style={{
                      color: "#008EDC",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {ctax == "..." ||
                    yourHP == "..." ||
                    netHP == "..." ||
                    miningPeriod == "..."
                      ? "..."
                      : parseFloat(
                          ((100 - (ctax + 51)) / 100) *
                            (yourHP / netHP) *
                            dailySupply *
                            miningPeriod
                        ).toFixed(3)}{" "}
                    EGOLD
                  </span>
                </div>

                <div className="yeiddiv" style={{ marginTop: 8 }}>
                  <span
                    style={{
                      color: "rgb(79, 107, 117)",
                    }}
                  >
                    Net Egold mined
                  </span>
                  <span
                    style={{
                      color: "#36B37E",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    {egPrice == "..." ||
                    ctax == "..." ||
                    yourHP == "..." ||
                    netHP == "..." ||
                    miningPeriod == "..."
                      ? "..."
                      : parseFloat(
                          ((egPrice * (100 - (ctax + 51))) / 100) *
                            (yourHP / netHP) *
                            dailySupply *
                            miningPeriod
                        ).toFixed(2)}{" "}
                    BUSD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
