import React from "react";
import "./App.css";
import Wallet from "./components/Wallet/Wallet";
import { WalletStatus } from "./components/WalletStatus/WalletStatus";
import { SendSepoliaETH } from "./components/SendSepolia/SendSepolia";
import Account from "./components/Accaunt/Accaunt";
import { useAccount } from "wagmi";

function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { chain } = useAccount();

  if (chain && chain.id !== 11155111) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h2>⚠ Please switch your MetaMask to Sepolia Testnet</h2>
        <p>Current network: {chain.name}</p>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <div>
      <NetworkGuard>
        <Wallet />
      </NetworkGuard>
      {/* <SendSepoliaETH /> */}
      <Account />
    </div>
  );
}

export default App;
