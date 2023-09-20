import React from "react";
import "./index.css";

import Header from "./components/Header/Header";
import HeaderNoWallet from "./components/Header/HeaderNoWallet";
import Footer from "./components/Footer/Footer";
import AppMiningCalc from "./components/AppMiningCalc";
import Wallet from "./components/Wallet/wallet";
import Send from "./components/Wallet/send";
import Receive from "./components/Wallet/receive";
import SelectToken from "./components/Wallet/SelectToken";

import Swap from "./components/AppTradeSwap";

import { hooks as metaMaskHooks, metaMask } from "./connectors/metaMask";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "./connectors/coinbaseWallet";
import {
  hooks as walletConnectV2Hooks,
  walletConnectV2,
} from "./connectors/walletConnect";

import ErrorPage from "./components/ErrorPage";
import { Web3ReactProvider } from "@web3-react/core";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

// To disable log on production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <div style={{ flex: "1 1" }}>
          <Header />
          <Swap />
        </div>
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/trade",
    element: (
      <>
        <div style={{ flex: "1 1" }}>
          <Header />
          <Swap />
        </div>
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/selecttoken",
    element: (
      <>
        <HeaderNoWallet />
        <SelectToken />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/wallet",
    element: (
      <>
        <HeaderNoWallet />
        <Wallet />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/send",
    element: (
      <>
        <HeaderNoWallet />
        <Send />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/receive",
    element: (
      <>
        <HeaderNoWallet />
        <Receive />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/calculator",
    element: (
      <>
        <Header />
        <AppMiningCalc />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
]);

const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const isSiteDown = false;

root.render(
  <StrictMode>
    <Web3ReactProvider connectors={connectors}>
      <div className="content">
        <div className="wrapper">
          <RouterProvider router={router} />
        </div>
      </div>
    </Web3ReactProvider>
  </StrictMode>
);
