import { useWeb3Modal } from '@web3modal/react';
import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';

function useCustomConnectWallet() {
  const { address, isConnected } = useAccount();
  const { open, isOpen } = useWeb3Modal();
  const { chain, chains } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork()
  const { disconnect: disconnectWallet } = useDisconnect();

  const [status, setStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        if (chain) {
          if (chain.unsupported) {
            setStatus('unsupported');
          } else {
            setStatus('connected');
          }
        } else {
          setStatus('disconnected');
        }
      } else {
        setStatus('disconnected');
      }
    })();
  }, [isConnected, chain]);

  const connect = async () => {
    try {
      setLoading(true);
      if (isOpen) {
        setLoading(false);
        return;
      }
      if (status === 'connected') {
        setLoading(false);
        return;
      }
      if (status === 'unsupported') {
        if (chains[0].id) {
          await switchNetworkAsync ? (chains[0].id || 0) : 0;
          setLoading(false);

        }
        return;
      }
      await open();
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      if (loading) return;
      if (!address) return;
      await disconnectWallet();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    address,
    status,
    connect,
    disconnect,
    loading: loading || isOpen,
  }
}

export default useCustomConnectWallet