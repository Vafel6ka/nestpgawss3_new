import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// 1. Отримайте WalletConnect Project ID з https://cloud.walletconnect.com/
// ЦЕ ОБОВ'ЯЗКОВО для WalletConnect.

const walletConnectProjectId = process.env.REACT_PROJECT_ID;


// 2. Налаштуйте ланцюги (chains) та провайдерів (transports)
// Рекомендується використовувати RPC-провайдера, як-от Alchemy або Infura.
// Отримайте безкоштовний ключ на https://www.alchemy.com/
const alchemyApiKey = process.env.ALCHEMY_API_KEY;

export const config = createConfig({
  // Масив ланцюгів, які підтримуватиме ваш додаток
  chains: [mainnet, sepolia],

  // Налаштування "транспортів" (як підключатися до блокчейну)
  transports: {
    // Кожен ланцюг потребує власного налаштування транспорту
    // Використовуйте http() та URL вашого RPC-провайдера
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },

  // Налаштування "конекторів" (які гаманці підтримувати)
  connectors: [
    // Injected-гаманці (напр., MetaMask, Brave, Rabby)
    injected(),
    
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'My Test Web3 App',
      // appLogoUrl: 'URL_TO_YOUR_APP_LOGO' // (Опціонально)
    }),
  ],

  // Це клієнтський додаток (не SSR), тому встановлюємо ssr: false
  ssr: false,
})