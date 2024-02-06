
import { roundDown } from '../helpers';
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

const NEXT_PUBLIC__NATIVE_ADDRESS = process.env.NEXT_PUBLIC__NATIVE_ADDRESS

function useCustomBalance(key: `0x${string}`, decimalFixed = 3) {
  const { address } = useAccount();
  const { data: balanceToken } = useBalance({
    address: address,
    ...(
      key !== NEXT_PUBLIC__NATIVE_ADDRESS
      && { token: key }
    ),
    watch: true,
  })

  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const balance = Math.floor(parseFloat(balanceToken?.formatted || '0') * 10 ** decimalFixed || 0) / 10 ** decimalFixed
    setBalance(balance)
  }, [balanceToken?.formatted])

  const setMaxBalanceValue = () => {
    return roundDown(balance, decimalFixed)
  }

  return {
    balance: balance || 0,
    setMaxBalanceValue
  }
}

export default useCustomBalance