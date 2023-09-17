import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

export const [walletConnectV2, hooks] = initializeConnector(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: process.env.REACT_APP_WALLETCONNECT_PID,
        chains: [56],
        showQrModal: true,
      },
    })
);
