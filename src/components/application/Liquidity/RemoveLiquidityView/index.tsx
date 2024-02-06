import React, { useEffect, useState } from 'react'
import { Button, Card, Slider } from 'antd';
import './style.scss';
import { useParams, useRouter } from 'next/navigation';
import { balanceOfPair, getPairData, removeLiquidity, totalSupplyOfPair, useEthersSigner } from '@/crypto-all-in-one';
import { useAccount } from 'wagmi';
import { SettingModal } from '@/components';
import { roundDown } from '@/helpers';
import { PairDataType } from '@/helpers/type';

const sliderOtions = [
  {
    value: 25,
    label: '25%'
  },
  {
    value: 50,
    label: '50%'
  },
  {
    value: 75,
    label: '75%'
  },
  {
    value: 100,
    label: 'Max'
  },
]

function RemoveLiquidityView() {
  const signer = useEthersSigner();
  const router = useRouter();
  const param = useParams();
  const { address } = useAccount();
  const [amountPecent, setAmountPercent] = useState(0);
  const [data, setData] = useState<PairDataType>({
    address: '',
    balancePair: 0,
    totalSupplyOfPair: 0,
    percent: '0',
    tokens: []
  });
  const [isReceiveNativeToken, setIsReceiveNativeToken] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  useEffect(() => {
    const { id } = param;

    if (id) {
      getPairInfo(id as string);
    }
  }, [param?.id])

  const getPairInfo = async (pair: string) => {
    try {
      setLoading(true);
      const balancePairVal = await balanceOfPair(signer, pair, address as `0x${string}`) as number;
      const totalSupplyOfPairVal = await totalSupplyOfPair(signer, pair) as number;
      const res = await getPairData(signer, pair) as any[];
      setData({
        address: pair,
        balancePair: balancePairVal,
        totalSupplyOfPair: totalSupplyOfPairVal,
        percent: (balancePairVal / totalSupplyOfPairVal * 100).toFixed(0),
        tokens: res,
      })
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const checkIsHasNativeToken = () => {
    if (data.tokens) {
      const nativeToken = data.tokens.find(token => token.address === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS);
      if (nativeToken) {
        return nativeToken.address;
      }
    }
    return ''
  }

  const handleRemoveLiquidity = async () => {
    try {
      const val = data.tokens?.findIndex(token => token.address === checkIsHasNativeToken())
      let native = ''
      if (isReceiveNativeToken) {
        native = ''
      } else {
        native = val === 0 ? 'tokenA' : val === 1 ? 'tokenB' : ''
      }
      setLoading(true);
      const tx = await removeLiquidity(
        signer,
        data.tokens[0].address,
        data.tokens[1].address,
        `${data.balancePair * amountPecent / 100}`,
        '0',
        '0',
        address as `0x${string}`,
        data.address,
        native
      ) as any;
      await tx.wait();
      setLoading(false);
      router.push('/liquidity');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
      <Card
        title={
          <div>
            <h1>
              Remove Liquidity
            </h1>
            <span style={{ whiteSpace: 'normal' }}>
              Tip: Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
            </span>
          </div>
        }
        style={{ width: 700 }}
      >
        <div className="remove-liquidity-view-main__content">
          <div className="slider">
            <div className="group-title">
              <div className="title">
                Remove amount
              </div>
            </div>
            <div className="number">
              {amountPecent}%
            </div>
            <div className="slider-main">
              <Slider value={amountPecent} onChange={(value) => setAmountPercent(value)} min={0} max={100} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {
                sliderOtions.map((item, index) => (
                  <Button key={index} style={{ width: '22%' }}
                    onClick={() => setAmountPercent(item.value)}
                  >{item.label}</Button>
                ))
              }
            </div>
          </div>
          <div className="total">
            {
              loading ? (
                <div className="loading">
                  Loading...
                </div>
              ) : (
                <>
                  {
                    data.tokens && data.tokens.map((token, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                        <div className="total-item__name">
                          {
                            isReceiveNativeToken && token.address === checkIsHasNativeToken() ? 'BONE' : token.symbol
                          }

                        </div>
                        <div className="total-item__value">
                          {roundDown(token.reserve * amountPecent / 100 * parseFloat(data.percent) / 100, 8)}
                        </div>
                      </div>
                    ))
                  }
                  {
                    checkIsHasNativeToken() && (
                      <Button onClick={() => setIsReceiveNativeToken(!isReceiveNativeToken)} type='primary' style={{ marginTop: 10, width: '100%' }}>
                        <span style={{
                          textDecoration: !isReceiveNativeToken ? 'underline' : 'none'
                        }}>Receive {
                            isReceiveNativeToken ? 'BONE' : 'WBONE'
                          }</span>

                      </Button>
                    )
                  }
                </>
              )
            }

          </div>
          <div className="price" style={{ marginTop: 20 }}>
            {
              loading ? (
                <div className="loading">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="name">
                    Price
                  </div>
                  <div className="group-stats">
                    <div className="stats_1">
                      1 {data?.tokens && data?.tokens.length === 2 && data.tokens[0].symbol} = {data?.tokens && data?.tokens.length === 2 && data.tokens[0].reserve / data.tokens[1].reserve} {data?.tokens && data?.tokens.length === 2 && data.tokens[1].symbol}
                    </div>
                    <div className="stats_2">
                      1 {data?.tokens && data?.tokens.length === 2 && data.tokens[1].symbol} = {data?.tokens && data?.tokens.length === 2 && data.tokens[1].reserve / data.tokens[0].reserve} {data?.tokens && data?.tokens.length === 2 && data.tokens[0].symbol}
                    </div>
                  </div>
                </>
              )
            }
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' onClick={() => {
              handleRemoveLiquidity()
            }} loading={loading}
              danger
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>
      <SettingModal isOpenModal={openSetting} setIsOpenModal={setOpenSetting} />

    </div>
  )
}

export default RemoveLiquidityView