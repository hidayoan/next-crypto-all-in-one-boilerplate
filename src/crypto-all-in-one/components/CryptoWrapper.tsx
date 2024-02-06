import React from 'react'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { Shibarium } from '../helpers/custom-chains';
import { CryptoWrapperType } from '@/helpers/type';

// config crypto
const NEXT_PUBLIC__PROJECT_ID = process.env.NEXT_PUBLIC__PROJECT_ID || "6bcdf0c89c31b7006685cf0eb5f562c5";
const chains = [Shibarium];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId: NEXT_PUBLIC__PROJECT_ID })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: NEXT_PUBLIC__PROJECT_ID, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function CryptoWrapper({ children }: CryptoWrapperType) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
      <Web3Modal
        projectId={NEXT_PUBLIC__PROJECT_ID}
        ethereumClient={ethereumClient}
        defaultChain={chains[0]}
        themeVariables={{
          // TODO: Add theme variables
          '--w3m-font-family': 'Quicksand',
          '--w3m-accent-color': '#3c4b98',
          '--w3m-background-color': '#3c4b98',
        }}
      />
    </>
  )
}

export default CryptoWrapper