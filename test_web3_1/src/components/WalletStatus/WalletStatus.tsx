import React, { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
    }
  }, [isConnected, address]);

  if (isConnected) {
    return (
      <div>
        <p>Під’єднано: {address}</p>
        <button onClick={() => disconnect()}>Від’єднати</button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Під’єднати {connector.name}
        </button>
      ))}
    </div>
  );
}
