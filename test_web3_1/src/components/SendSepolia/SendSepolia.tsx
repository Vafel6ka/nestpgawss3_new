import React, { useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useEstimateGas,
} from "wagmi";
import { parseEther } from "viem";

export const SendSepoliaETH: React.FC = () => {
  const toAddresWalet2 = "0xA0D9F85ba683c55515815D92ef778F86d9D65CaD";
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Оцінюємо газ
  const { data: gas } = useEstimateGas({
    to: toAddresWalet2,
    value: parseEther("0.5"),
  });

  // Виклик useSendTransaction без to/value тут
  const { data, sendTransaction, status, error } = useSendTransaction();

  const handleSend = () => {
    if (!sendTransaction || !toAddresWalet2) return;

    sendTransaction(
      {
        to: toAddresWalet2,
        value: parseEther("0.5"),
        gas: gas,
      },
      {
        onSuccess(hash) {
          // Зберігаємо хеш транзакції
          setTxHash(hash);
        },
        onError(err) {
          // Вивести помилку користувача
          if (err.message === "User denied transaction signature") {
            setErrorMessage("Транзакцію відхилено користувачем.");
          } else {
            setErrorMessage(`Помилка: ${err.message}`);
          }
        },
      }
    );
  };

  // Перевірка, чи є префікс '0x' у хеші, і додавання його, якщо немає
  const formattedTxHash =
    txHash && !txHash.startsWith("0x") ? `0x${txHash}` : txHash;

  const { data: receipt, isSuccess } = useWaitForTransactionReceipt({
    hash: formattedTxHash as any,
  });

  return (
    <div>
      {!isConnected && <p>Будь ласка, під’єднай гаманець</p>}

      <button onClick={handleSend} disabled={!sendTransaction}>
        {status === "pending" ? "Відправка..." : "Відправити 0.5 Sepolia ETH"}
      </button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {txHash && <p>TX Hash: {txHash}</p>}
      {isSuccess && receipt && (
        <p>Підтверджено! Хеш: {receipt.transactionHash}</p>
      )}
    </div>
  );
};
