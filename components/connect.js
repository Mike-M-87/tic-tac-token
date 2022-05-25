import "@rainbow-me/rainbowkit/styles.css";
import ERC20 from '../abis/erc20.json'
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
  midnightTheme
} from "@rainbow-me/rainbowkit";

import { chain, createClient, useAccount, useContract, useContractRead, useContractWrite, useNetwork, useProvider, useSendTransaction, useSigner, WagmiProvider } from "wagmi";
import { useEffect, useState } from "react";
import LoadingScreen from "./loading";
import { CardanoAddress, DestinationAddress, ETHAddress, USDCAddress } from "../constants";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.rinkeby, chain.arbitrum, chain.optimism],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "Tic Tac Token",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export function RainbowD({ usdcAmt }) {
  const [isMounted, setIsMounted] = useState(false);
  const { data: accountData } = useAccount();
  const { activeChain } = useNetwork();

  const signer = useSigner()
  const provider = useProvider()

  const { data, error, isIdle, isSuccess, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: USDCAddress,
      contractInterface: ERC20.abi,
      signerOrProvider: signer.data || provider,
    },
    "transfer",
  );


  async function TransferFunds(amount) {
    if (amount <= 0) {
      return
    }
    amount = amount * Math.pow(10, 6)
    console.log(amount);
    const fund = await write({ args: [DestinationAddress, amount] });
  }

  if (isSuccess) {
    console.log(data);
  }
  if (isError && error.message == "Connector not found") {
    window.location.reload()
  }


  useEffect(() => setIsMounted(true), []);

  return (
    <>
      <ConnectButton
        label="Connect Wallet"
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
        showBalance={true}
        chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
      />

      {isMounted && (
        <>
          <div className="text break ms-2">
            {isLoading && <LoadingScreen />}
            <p>{!accountData && <span>(not connected)</span>}</p>
            <p>{isError && <span>Error sending transaction: {error.message}</span>}</p>
            <p>{isIdle && <span>Waiting...</span>}</p>
          </div>
          <button
            className={accountData ? "fs-5 w-100 join-button" : "btn btn-secondary fs-5 w-100"}
            disabled={!accountData}
            onClick={() => TransferFunds(usdcAmt)}
            type="button">Send Transaction
          </button>
        </>
      )}
    </>
  );
};


export default function Connect({ usdcAmt }) {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        theme={darkTheme({
          ...darkTheme.accentColors.orange,
          accentColorForeground: "white"
        })}
        coolMode
      >
        <RainbowD usdcAmt={usdcAmt} />
      </RainbowKitProvider>
    </WagmiProvider>
  )
}