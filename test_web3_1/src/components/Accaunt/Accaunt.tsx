import React, { useState } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { setAccessToken } from "../../utils/accessTokens";

export default function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { isError, signMessageAsync } = useSignMessage();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleLogin = async () => {
    console.log("address", address);
    if (!address) return;

    try {
      // 1. Отримуємо nonce
      const nonceResponse = await fetch(`${baseUrl}/auth/request-nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!nonceResponse.ok) {
        const errorData = await nonceResponse.json();
        console.log(
          "Failed to get nonce: " + (errorData.message || "Unknown error")
        );
        return;
      }

      const { nonce } = await nonceResponse.json(); // <-- тут дістаємо nonce

      // 2. Підписуємо повідомлення з nonce
      const signature = await signMessageAsync({
        message: `Login to MyApp with address: ${nonce}`, // <-- важливо: саме nonce!
      });

      if (!signature) return;

      // 3. Відправляємо адресу та підпис на сервер
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Login failed: " + (errorData.message || "Unknown error"));
        return;
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      console.log("JWT Token: " + data.access_token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const [status, setStatus] = useState<string>("");

  const checkServer = async () => {
    try {
      const response = await fetch("http://localhost:4000"); // або свій базовий URL
      // if (!response.ok) {
      //   setStatus(`Error: ${response}`);
      //   return;
      // }
      console.log("response", response);
      setStatus(`Server response: ${response.status}`);
    } catch (err) {
      setStatus(`Fetch error: ${err}`);
    }
  };

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
      <button onClick={handleLogin}>LOGIN</button>
      <button onClick={checkServer}>Status:{status}</button>
    </div>
  );
}
