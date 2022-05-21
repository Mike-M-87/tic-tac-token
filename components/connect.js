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

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const RainbowD = () => {

  const [isMounted, setIsMounted] = useState(false);
  const { data: accountData } = useAccount();
  useEffect(() => setIsMounted(true), []);
  const { activeChain } = useNetwork();

  const signer = useSigner()
  const provider = useProvider()

  const arrr = {
    args: ["ire.eth", 1],
  }
  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      contractInterface: ERC20.abi,
      signerOrProvider: signer.data || provider,
    },
    "transfer",
  );


  async function Transsssssfer() {
    const d = await write({ args: ["saitama.eth", 1] });
  }

  return (
    <>

      <ConnectButton />

      {isMounted && (
        <>
          <div style={{ fontFamily: "sans-serif" }}>
            <h3>
              Example Actions {!accountData && <span>(not connected)</span>}
            </h3>
            <div style={{ display: "flex", gap: 12, paddingBottom: 12 }}>
              <button
                className="btn btn-dark"
                disabled={!accountData}
                onClick={() => Transsssssfer()}
                type="button"
              >
                Send Transaction
              </button>

            </div>
            <div>
              {data && (
                <div>Tranfeering: {JSON.stringify(data)}</div>
              )}
              {isError && <div>Error sending transaction</div>}
            </div>
          </div>
        </>
      )}
    </>
  );
};


export default function Connect() {
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
        <RainbowD />
      </RainbowKitProvider>
    </WagmiProvider>
  )
}