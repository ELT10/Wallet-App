import React, { useEffect, useState } from "react";
import TradeWidget from "./Trade/Swap/TradeWidget";
import WalletButton from "./Buttons/WalletButton/WalletButton";
import { useWeb3React } from "@web3-react/core";


export default function Swap() {
  const { account, isActive, connector } = useWeb3React();
  
  return (
    <>
      <div
        class="mainsection"
        style={{
          position: "relative",
        }}
      >
        <div class="minertabsec secpadding lightgrey-bg brtlr">
          <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-trade" role="tabpanel" aria-labelledby="pills-trade-tab" tabindex="0">
              <div class="wallettabsec egoldsubtabsec lightgrey-bg brtlr">
                <div class="tab-content" id="pills-tabContent">
                  <div class="tab-pane fade show active" id="pills-swap" role="tabpanel" aria-labelledby="pills-swap-tab" tabindex="0">
                  <TradeWidget/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lightblue-bg secpadding brblr mb20">
          <p class="text1">
            Welcome to Egold Miner Shop. Please select a miner from the list
            above to make a purchase. Each miner has a different mining power
            and price.
          </p>
        </div>
        <div
          id="overlay"
          style={
            localStorage.getItem("acct") || isActive ? { display: "none" } : {}
          }
        >
          <div className="connectinoverlay">
            {" "}
            <WalletButton />
          </div>
          Please connect your wallet to continue
        </div>
      </div>
    </>
  );
}
