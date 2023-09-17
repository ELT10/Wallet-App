import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";
import { BscConnector } from "@binance-chain/bsc-connector";
import { metaMask } from "../../../connectors/metaMask";
import { walletConnectV2 } from "../../../connectors/walletConnect";
import { coinbaseWallet } from "../../../connectors/coinbaseWallet";

import metamax from "../../../images/metamaxicon.png";
import trustwall from "../../../images/trustwallet.png";
import bcwall from "../../../images/binanceicon.png";
import spwall from "../../../images/safewallet.png";
import wcwall from "../../../images/walletconnecticon.png";
import tpwall from "../../../images/tokenpocketicon.png";
import otwall from "../../../images/webwalleticon.png";

export default function WalletButton() {
  const { account, isActive, connector } = useWeb3React();
  let navigate = useNavigate();
  const [modalV, setmodalV] = useState(false);
  const [acctADDR, setacctADDR] = useState(localStorage.getItem("acct"));
  const toggleModal = () => {
    setmodalV(!modalV);
  };

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  function addBscChain() {
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 3000);
    }

    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum) {
        console.log("Ethereum successfully detected!");
      } else {
        console.error("Ethereum not detected.");
      }
    }
    const BSC_MAINNET_PARAMS = {
      chainId: process.env.REACT_APP_CHAINIDHEX,
      chainName: "Binance Smart Chain",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: [process.env.REACT_APP_RPC],
      blockExplorerUrls: ["https://bscscan.io/"],
    };
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_chainId",
        })
        .then((res) => {
          if (res != "0x38")
            window.ethereum
              .request({
                method: "wallet_addEthereumChain",
                params: [BSC_MAINNET_PARAMS],
              })
              .then(() => {
                console.log("BSC Added");
              })
              .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  }

  function getAddChainParameters(chainId) {
    return {
      chainId,
      chainName: "BSC",
      nativeCurrency: "BNB",
      rpcUrls: "https://bsc-dataseed.binance.org",
    };
  }

  const changeNetwork = async (wallet) => {
    try {
      addBscChain();
      if (wallet == "Metamask") {
        console.log("hererere111");
        localStorage.setItem("wallettype", "Metamask");
        const bscdets = getAddChainParameters(56);
        await metaMask.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "WalletConnect") {
        localStorage.setItem("wallettype", "WalletConnect");
        setmodalV(false);
        await walletConnectV2.activate(56);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "BCW") {
        localStorage.setItem("wallettype", "BCW");
        const bsc = new BscConnector({ supportedChainIds: [56, 97] });
        await bsc.activate();
        setmodalV(false);
        console.log("aCCTOUNT BINANCE", account);
        setacctADDR(account);
      }
      if (wallet == "Coinbase") {
        localStorage.setItem("wallettype", "Coinbase");
        const bscdets = getAddChainParameters(56);
        await coinbaseWallet.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "Trustwallet") {
        localStorage.setItem("wallettype", "Trustwallet");
        const bscdets = getAddChainParameters(56);
        await metaMask.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "Others") {
        localStorage.setItem("wallettype", "Others");
        const bscdets = getAddChainParameters(56);
        await metaMask.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "TokenPocket") {
        localStorage.setItem("wallettype", "TokenPocket");
        const bscdets = getAddChainParameters(56);
        await metaMask.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
      }
      if (wallet == "SafePal") {
        localStorage.setItem("wallettype", "SafePal");
        const bscdets = getAddChainParameters(56);
        await metaMask.activate(bscdets);
        setmodalV(false);
        window.localStorage.setItem("isWalletConnected", true);
        setacctADDR(account);
        localStorage.setItem("acct", account);
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  useEffect(() => {
    if (isActive) {
      window.localStorage.setItem("isWalletConnected", true);
      console.log("!~~~~Acccount",account);
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
    if (!isActive && localStorage.getItem("wallettype")) {
      if (localStorage.getItem("wallettype") == "WalletConnect") {
        walletConnectV2.connectEagerly().catch((error) => {
          console.debug("Failed to connect eagerly to walletconnect", error);
        });
      } else if (localStorage.getItem("wallettype") == "Coinbase") {
        void coinbaseWallet.connectEagerly().catch(() => {
          console.debug("Failed to connect eagerly to coinbase wallet");
        });
      } else if (localStorage.getItem("wallettype")) {
        void metaMask.connectEagerly().catch(() => {
          console.debug("Failed to connect eagerly to metamask");
        });
      }
      // changeNetwork(localStorage.getItem("wallettype"));
      setmodalV(false);
    }
  }, []);

  const refreshState = () => {
    localStorage.clear();
    setacctADDR("");
    navigate("/");
    if (connector?.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
  };

  return (
    <>
      {localStorage.getItem("acct") ? (
        <Button
          className="walletbtns"
          onClick={() => {
            refreshState();
            console.log("ACCOUT AFTER", account);
          }}
        >
          DISCONNECT
        </Button>
      ) : (
        <Button
          className="walletbtns"
          onClick={() => {
            setmodalV(true);
          }}
        >
          CONNECT WALLET
        </Button>
      )}

      <Modal
        isOpen={modalV}
        toggle={toggleModal}
        size="sm"
        backdrop="static"
        backdropClassName="connectmodalbg"
      >
        <ModalHeader
          toggle={toggleModal}
          style={{
            color: "black",
            padding: "1.7rem",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              fontWeight: "600",
              color: "#000",
            }}
          >
            Connect Using :
          </div>
        </ModalHeader>
        <ModalBody
          style={{ background: "#fff", borderRadius: "12px", padding: "1rem" }}
        >
          <div>
            <ul className="wallet-lists">
              <li
                style={{ marginTop: "0px" }}
                onClick={() => {
                  changeNetwork("Metamask");
                  setProvider("injected");
                }}
              >
                <a>
                  Metamask <img src={metamax} />
                </a>
              </li>
              <li
                onClick={() => {
                  changeNetwork("WalletConnect");
                  setProvider("walletConnect");
                }}
              >
                <a>
                  WalletConnect <img src={wcwall} />
                </a>
              </li>
              <li
                onClick={() => {
                  changeNetwork("Trustwallet");
                  setProvider("injected");
                }}
              >
                <a>
                  TrustWallet <img src={trustwall} />
                </a>
              </li>
              {/* <li>
                <a
                  onClick={() => {
                    changeNetwork("BCW");
                    setProvider("Binance Chain");
                  }}
                >
                  Binance chain Wallet <img src={bcwall} />
                </a>
              </li> */}
              <li
                onClick={() => {
                  changeNetwork("SafePal");
                  setProvider("injected");
                }}
              >
                <a>
                  SafePal Wallet <img src={spwall} />
                </a>
              </li>
              <li
                onClick={() => {
                  changeNetwork("TokenPocket");
                  setProvider("injected");
                }}
              >
                <a>
                  TokenPocket <img src={tpwall} />
                </a>
              </li>
              <li
                onClick={() => {
                  changeNetwork("Others");
                  setProvider("injected");
                }}
              >
                <a>
                  Other Web3 Wallets <img src={otwall} />
                </a>
              </li>
            </ul>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
