import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

export const [coinbaseWallet, hooks] = initializeConnector(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: "https://bsc-dataseed.binance.org",
        appName: "EgoldShop",
      },
    })
);
