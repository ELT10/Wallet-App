import React, { useEffect, useState } from "react";
import WalletButton from "../Buttons/WalletButton/WalletButton";
import { useWeb3React } from "@web3-react/core";

export default function MinerCard(props) {
  const { account, isActive, connector } = useWeb3React();
  return (
    <div
      style={
        localStorage.getItem("acct") || isActive ? { display: "none" } : {}
      }
    >
      <div class="walletamtsec mb20">
        <div class="darksec-bg secpadding brtlr">
          <div class="row">
            <div class="col-8 d-flex align-items-center">
              <p class=" text-white ">You're not connected</p>
            </div>
            <div
              class="col-4 "
              style={{
                backgroundColor: "#f2b40c",
                borderRadius: "8px",
                padding: "5px 25px",
              }}
            >
              <p class=" text-white text-end blacktxtbtn">
                <WalletButton />
              </p>
            </div>
          </div>
        </div>
        <div
          class="lightblue-bg secpadding brblr"
          style={{ padding: "45px 20px", background: "#394e56" }}
        >
          <p class="text1 text-justify text-center" style={{ color: "white" }}>
            Please connect your wallet to view this page.
          </p>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
