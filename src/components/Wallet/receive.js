import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { FaRegCopy } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import "./css/receive.css";
import BackButton from "../Buttons/BackButton/BackButton";
export default function Recieve() {
  const location = useLocation()

  const [sendToken, setsendToken] = useState("bnb");

  useEffect(() => {
    setsendToken(location.state)
  }, []);


  return (
    <main>
      <div class="mainsection">
        <div class="tabsec secpadding lightgrey-bg brtlr">
          <BackButton Title="Receive" ReRoute="wallet" />
          <select
            value={sendToken}
            class="form-select darksec-bg text-white mb20"
            aria-label="Default select example"
          >
            <option selected="bnb">BNB - BEP20</option>
            <option value="wbnb">WBNB</option>
            <option value="egold">EGOLD</option>
            <option value="busd">BUSD</option>
            <option value="cbk">CBK</option>
          </select>

          <p class="barcodeimg mb20" style={{ marginTop: 50 }}>
            <QRCode value={localStorage.getItem("acct")} size={256} />
          </p>
          <div class="copysharegroup">
            <div
              class="featurebtn"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await navigator.clipboard.writeText(
                  localStorage.getItem("acct")
                );
              }}
            >
              <div class="featureimg">
                <FaRegCopy size={20} color="white" />
              </div>

              <p>Copy</p>
            </div>
            <div
              class="featurebtn"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await navigator.share({ text: localStorage.getItem("acct") });
              }}
            >
              <div class="featureimg">
                <IoShareOutline size={22} color="white" />
              </div>
              <p>Share</p>
            </div>
          </div>
        </div>

        <div class="lightblue-bg secpadding brblr mb20">
          <p class="text1">
            Send only BUSD Token (BEP20) to this address. Sending any other
            coins may result in permanent loss.
          </p>
        </div>
      </div>
    </main>
  );
}
