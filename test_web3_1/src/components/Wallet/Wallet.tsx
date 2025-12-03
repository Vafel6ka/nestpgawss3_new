import React from "react";
import {
  Connector,
  CreateConnectorFn,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "wagmi";

export default function Wallet() {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address,
  });

  const metaMaskConnector = connectors.filter(
    (con) => con.name === "Injected"
  )[0];
  return (
    <div>
      <button
        onClick={async () => {
          if (!metaMaskConnector) {
            console.error("MetaMask connector not found");
            return;
          }

          try {
            connect({ connector: metaMaskConnector });
          } catch (error) {
            console.error("Connection error:", error);
          }
        }}
      >
        Connect MetaMask
      </button>

      {isConnected && address && (
        <div>
          <p>Під’єднано: {address}</p>
          {isLoading ? (
            <p>Balance loading</p>
          ) : isError ? (
            <p>Balance Error</p>
          ) : (
            <p>{balance?.value} ETH</p>
          )}
          <button onClick={() => disconnect()}>Від’єднати</button>
        </div>
      )}
    </div>
  );

  // return connectors.map((connector) => {
  //   console.log(connector.name)
  //   return (
  //   <button key={connector.uid} onClick={() => connect({ connector })}>
  //     {connector.name}
  //   </button>
  // )});
}
