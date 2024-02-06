import { Button, Collapse } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import './style.scss'
import { useEthersSigner, balanceOfPair, getPairData, totalSupplyOfPair } from '@/crypto-all-in-one';
import { roundDown } from '@/helpers';
import { BalancePairType, PairDataType } from '@/helpers/type';
const { Panel } = Collapse;

function BalancePair({ pair }: BalancePairType) {
  const router = useRouter()
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [data, setData] = useState<PairDataType>({
    address: '',
    balancePair: 0,
    totalSupplyOfPair: 0,
    percent: '0',
    tokens: []
  });
  const [active, setActive] = useState('');

  useEffect(() => {
    getPairInfo();
  }, [pair])

  const getPairInfo = async () => {
    try {
      const balancePairVal = await balanceOfPair(signer, pair, address as string) as number;
      const totalSupplyOfPairVal = await totalSupplyOfPair(signer, pair) as number;
      const res = await getPairData(signer, pair) as any[];
      setData({
        address: pair,
        balancePair: balancePairVal,
        totalSupplyOfPair: totalSupplyOfPairVal,
        percent: (balancePairVal / totalSupplyOfPairVal * 100).toFixed(0),
        tokens: res,
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleManage = () => {
    if (active === pair) {
      setActive('');
    } else {
      setActive(pair);
    }
  }

  const handleRemoveLiquidity = () => {
    router.push(`/liquidity/remove-liquidity/${pair}`);
  }

  return (
    <div className="balance-pair">
      <Collapse accordion activeKey={active}>
        <Panel
          key={pair}
          showArrow={false}
          header={
            <div onClick={handleManage} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className='balance-pair__header--title'>
                <div className='balance-pair__header--title--name'>
                  {data?.tokens && data?.tokens.length === 2 && data?.tokens[0]?.symbol} - {data?.tokens && data?.tokens.length === 2 && data.tokens[1]?.symbol}
                </div>
              </div>
              <div className='balance-pair__header--actions'>
                <Button className='btn btn--primary' onClick={handleManage}>Manage</Button>
              </div>
            </div>
          }
        >
          <div className='balance-pair__content'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div className="title">
                Your total pool tokens:
              </div>
              <div className="value">
                {roundDown(data.balancePair, 4)}
              </div>
            </div>
            {
              data.tokens && data.tokens.map((token, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="title">
                    Pool {token.symbol}:
                  </div>
                  <div className="value">
                    {roundDown(token.reserve, 4)}
                  </div>
                </div>
              ))
            }
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                Your pool share:
              </div>
              <div className="value">
                {roundDown(parseFloat(data.percent), 4)}%
              </div>
            </div>

            <div className="balance-pair__content--actions"  style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <Button className='add-liquidity btn btn--primary'
                onClick={() => {
                  router.push(`/liquidity/add-liquidity?token1=${data.tokens[0].address}&token2=${data.tokens[1].address}&token1Symbol=${data.tokens[0].symbol}&token2Symbol=${data.tokens[1].symbol}`)
                }}
              >Add Liquidity</Button>
              <Button className='remove-liquidity btn btn--primary'
                onClick={() => {
                  handleRemoveLiquidity()
                }}
                danger
              >Remove Liquidity</Button>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  )
}

export default BalancePair