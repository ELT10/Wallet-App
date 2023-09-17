import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import WalletCard from "../WalletCard/WalletCard";
import WalletButton from "../Buttons/WalletButton/WalletButton";
import logo from "../../images/Egold_logo.svg";

export default function Header() {
  let navigate = useNavigate();
  const { account ,isActive} = useWeb3React();
  const [acctADDR, setacctADDR] = useState(localStorage.getItem("acct"));

  useEffect(() => {
    if (isActive) {
      window.localStorage.setItem("isWalletConnected", true);
      window.localStorage.setItem("acct", account);
      setacctADDR(account);
    } else {
      setacctADDR("");
    }
  }, [account]);

  useEffect(() => {
    if(acctADDR)
    if (localStorage.getItem("isWalletConnected") == "true") {
      localStorage.setItem("acct", acctADDR);
    }
  }, [acctADDR]);

  useEffect(() => {
    setacctADDR(localStorage.getItem("acct"));
  }, []);

  return (
    <>
      <div class="headcontainer">
        <header id="header" class=" d-flex align-items-center">
          <div class="container d-flex align-items-center justify-content-between innerhc">
            <div class="logo">
              <h1 class="text-light">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  {" "}
                  <img src={logo} />
                </a>
              </h1>
            </div>
            <nav id="navbar" class="navbar">
              <a class="disconnetbtn">
                <WalletButton />
              </a>
            </nav>
          </div>
        </header>
      </div>
      {localStorage.getItem("acct") && (
        <div class="mainsection">
          <div class="connectto mb20">
            <p class="text1 fw700 concon">Connected to</p>
            <p class="text1 add">{account ? account : "..."}</p>
          </div>
          <WalletCard />
        </div>
      )}
    </>
  );
}
