import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
  midnightTheme
} from "@rainbow-me/rainbowkit";

import { chain, createClient, WagmiProvider } from "wagmi";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
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

export default function Connect() {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}
        theme={midnightTheme()}>
        <ConnectButton
          label="Connect"
          showBalance={{ smallScreen: false, largeScreen: true }}
          accountStatus={{ smallScreen: "address", largeScreen: "full" }}
          chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        />
      </RainbowKitProvider>
    </WagmiProvider>
  );
};