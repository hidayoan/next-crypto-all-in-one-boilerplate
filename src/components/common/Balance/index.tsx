
import { useCustomBalance } from '@/crypto-all-in-one/custom-hook';
import { BalanceType } from '@/helpers/type';
import React, { useEffect } from 'react'

function Balance({ tokenAddress, onSyncBalance }: BalanceType) {
  const { balance } = useCustomBalance(tokenAddress, 10);

  useEffect(() => {
    if (onSyncBalance) {
      onSyncBalance(balance)
    }
  }, [balance])

  return (
    <>{balance}</>
  )
}

export default Balance