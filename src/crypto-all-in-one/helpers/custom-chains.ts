import { Chain } from '@wagmi/core'

export const ShibariumBeta = {
  id: 719,
  name: 'Shibarium Beta',
  network: 'Shibarium Beta',
  nativeCurrency: {
    decimals: 18,
    name: 'YOUR_TOKEN_NAME',
    symbol: 'YOUR_TOKEN_NAME',
  },
  rpcUrls: {
    public: { http: ['https://puppynet.shibrpc.com'] },
    default: { http: ['https://puppynet.shibrpc.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Shibscan (https://puppyscan.shib.io/)', url: 'https://puppyscan.shib.io/' },
    default: { name: 'Shibscan (https://puppyscan.shib.io/)', url: 'https://puppyscan.shib.io/' },
  },
  contracts: {
    multicall2: {
      address: '0xA183Ae615E83F01fb9e0C8Fa8959B96a6460b061',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain


export const Shibarium = {
  id: 109,
  name: 'Shibarium Mainnet',
  network: 'Shibarium Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'YOUR_TOKEN_NAME',
    symbol: 'YOUR_TOKEN_NAME',
  },
  rpcUrls: {
    public: { http: ['https://www.shibrpc.com'] },
    default: { http: ['https://www.shibrpc.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Shibscan (https://www.shibariumscan.io/)', url: 'https://www.shibariumscan.io/' },
    default: { name: 'Shibscan (https://www.shibariumscan.io/)', url: 'https://www.shibariumscan.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xd1727fC8F78aBA7DD6294f6033D74c72Ccd3D3B0',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain