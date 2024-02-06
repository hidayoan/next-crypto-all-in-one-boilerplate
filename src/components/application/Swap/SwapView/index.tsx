import React, { useEffect, useState } from 'react';
import './style.scss'
import { Card, message } from 'antd';
import { useCustomConnectWallet, useEthersSigner } from '@/crypto-all-in-one';
import { depositWNative, gerPair, getAmountIn, getAmountOut, getPairData, swapExactETHForTokens, swapExactTokensForETH, swapExactTokensForTokens, withdrawWNative } from '@/crypto-all-in-one';
import { checkNativeToken } from '@/helpers';
import { ButtonCustom, InputSwap, SettingModal } from '@/components';

const list = [
  {
    key: process.env.NEXT_PUBLIC__NATIVE_ADDRESS,
    value: "BONE",
    link: "/tokens/bone.jpg",
  },
  {
    key: process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS,
    value: "WBONE",
    link: "/tokens/bone.jpg",
  },
];

function SwapView() {
  const {
    address,
    status,
    connect,
    disconnect,
  } = useCustomConnectWallet();

  const handleClick = async () => {
    if (status === "connected") {
      disconnect();
    } else {
      connect();
    }
  }
  const [impact, setImpact] = useState(0);
  const [openSetting, setOpenSetting] = useState(false);
  const signer = useEthersSigner();

  const [loading, setLoading] = useState(false);
  const [loadingSwap, setLoadingSwap] = useState(false);

  const [fromData, setFromData] = useState({
    address: list[0].key,
    name: list[0].value,
    amount: "0",
  });
  const [toData, setToData] = useState({
    address: list[0].key,
    name: list[0].value,
    amount: "0",
  });

  const [setting, setSetting] = useState({
    slippageTolerance: 0.5,
    transactionDeadline: 2,
    autoRouterAPI: false,
    expertMode: false,
  });
  const [pairData, setPairData] = useState<any[]>([]);

  useEffect(() => {
    getPairDataValue();

    fetchAmountOut(parseFloat(fromData.amount));
  }, [fromData.address, toData.address]);

  const getPairDataValue = async () => {
    try {
      const res = await gerPair(signer, checkNativeToken(fromData.address || '') || '', checkNativeToken(toData.address || '') || '') as string;
      console.log(res);
      if (res === '0x0000000000000000000000000000000000000000') {
        setPairData([]);
      } else {
        const [token1, token2] = await getPairData(signer, res || '') as any[]
        if (token1.reserve > 0 && token2.reserve > 0) {
          setPairData([token1, token2]);
        } else {
          setPairData([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAmountOut = async (value: number) => {
    try {
      if (value == 0) {
        setToData({
          ...toData,
          amount: "0",
        });
        setImpact(0);
        setLoading(false);
        return
      }
      setLoading(true);
      const fromVal = checkNativeToken(fromData.address || '') || '';
      const toVal = checkNativeToken(toData.address || '') || '';
      const { amountOut: res, impact: impactValue } = await getAmountOut(signer, `${value}`, fromVal, toVal) as any;
      setToData({
        ...toData,
        amount: res,
      });
      setImpact(impactValue);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchAmountIn = async (value: number) => {
    try {
      if (value == 0) {
        setFromData({
          ...fromData,
          amount: "0",
        });
        setImpact(0);
        setLoading(false);
        return
      }
      setLoading(true);
      const fromVal = checkNativeToken(fromData.address || '') || '';
      const toVal = checkNativeToken(toData.address || '') || '';
      const { amountIn: res, impact: impactValue } = await getAmountIn(signer, `${value}`, fromVal, toVal) as any;
      setFromData({
        ...fromData,
        amount: res,
      });
      setImpact(impactValue);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setFromData({
      ...toData
    });
    setToData({
      ...fromData
    });
  };

  const swapTokens = async () => {
    if (status === "disconnected") {
      handleClick();
      return;
    }
    if (status === "unsupported") {
      handleClick();
      return;
    }
    try {
      setLoadingSwap(true);
      const ethAddress = process.env.NEXT_PUBLIC__NATIVE_ADDRESS || "";
      const wrapNativeAddress = process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || "";
      if (fromData.address === ethAddress) {
        if (toData.address === wrapNativeAddress) {
          const tx = await depositWNative(signer, `${fromData.amount}`, wrapNativeAddress) as any;
          await tx?.wait();
          setLoadingSwap(false);
        } else {
          const tx = await swapExactETHForTokens(signer, `${fromData.amount}`, setting.slippageTolerance / 100, setting.transactionDeadline, toData.address || '', address as string) as any;
          await tx?.wait();
          setLoadingSwap(false);
        }
      } else if (toData.address === ethAddress) {
        if (fromData.address === wrapNativeAddress) {
          const tx = await withdrawWNative(signer, `${fromData.amount}`, wrapNativeAddress) as any;
          await tx?.wait();
          setLoadingSwap(false);
        } else {
          const tx = await swapExactTokensForETH(signer, `${fromData.amount}`, setting.slippageTolerance / 100, setting.transactionDeadline, fromData.address || '', address as string) as any;
          await tx?.wait();
          setLoadingSwap(false);
        }
      } else {
        // swapExactTokensForTokens
        const tx = await swapExactTokensForTokens(
          signer,
          `${fromData.amount}`, setting.slippageTolerance / 100, setting.transactionDeadline,
          fromData.address || '',
          toData.address || '',
          address as string
        ) as any;
        await tx?.wait();
        setLoadingSwap(false);
      }
      message.success({
        content: "Your transaction has been successful.",
      })
    } catch (error: any) {
      setLoadingSwap(false);
      if (error['reason'] === "underflow") {
        message.error({
          content: "Error: You should increase slippage tolerance.",
        })
      }
    }
  };

  const handleAsyncSetting = (formData: {}) => {
    const newSetting = { ...setting, ...formData };
    setSetting(newSetting);
  }

  const findItem = (item: any) => {
    return pairData?.find((i) => i.address.toLowerCase() === (checkNativeToken(item))?.toLowerCase());
  }

  const checkShowHighImpact = () => {
    return impact > setting.slippageTolerance;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>

      <Card
        title="Swap"
        extra={
          <ButtonCustom
            onClick={() => setOpenSetting(true)}
            content={
              <span>Setting</span>
            }
          />
        }
        style={{ width: 700 }}
      >
        <div>
          <InputSwap
            list={list}
            data={fromData}
            asyncData={(val) => {
              setFromData({
                ...fromData,
                ...val,
              });
              fetchAmountOut(val.amount);
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <ButtonCustom
            onClick={handleSwitch}
            content={
              <span>Switch</span>
            }
          />
        </div>
        <div>
          <InputSwap
            list={list}
            data={toData}
            asyncData={(val) => {
              setToData({
                ...toData,
                ...val,
              });
              fetchAmountIn(val.amount);
            }}
          />
        </div>
        <div>
          <div className="slip-percent">
            <div className="slip">
              Slippage Tolerance:
            </div>
            <div className="percent">
              {setting.slippageTolerance}%
            </div>
          </div>
        </div>
        <div>
          {
            checkShowHighImpact() ? (
              <ButtonCustom
                className="btn-swap"
                content={
                  <span style={{
                    color: '#bdbdbd'
                  }}>Price Impact High</span>
                }
                isDisabled={true}
                background={'#707070'}
              />
            ) : <>
              {
                pairData.length === 2 && pairData[0].reserve > 0 && pairData[1].reserve > 0 ? (
                  <>
                    <ButtonCustom
                      style={{ width: '100%', padding: '10px', height: '48px' }}
                      isLoading={loading || loadingSwap}
                      onClick={swapTokens}
                      content={
                        <>
                          {
                            status === "connected" ? (
                              <span>Swap</span>
                            ) :
                              status === "disconnected" ? (
                                <span>Connect Wallet</span>
                              ) :
                                status === "unsupported" ? (
                                  <span>Switch Network</span>
                                ) : ''
                          }
                        </>
                      }
                    />
                    <div className="info">
                      <span>
                        1 {findItem(fromData.address)?.symbol} = {
                          parseFloat(toData.amount) > 0 && parseFloat(fromData.amount) > 0 ? (
                            parseFloat(toData.amount) / parseFloat(fromData.amount)
                          ) : (
                            findItem(toData.address)?.reserve / findItem(fromData.address)?.reserve
                          )
                        } {findItem(toData.address)?.symbol}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {
                      ((fromData.address === process.env.NEXT_PUBLIC__NATIVE_ADDRESS && toData.address === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS)
                        || (fromData.address === process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS && toData.address === process.env.NEXT_PUBLIC__NATIVE_ADDRESS))
                        ? (
                          <>
                            <ButtonCustom
                              style={{ width: '100%', padding: '10px', height: '48px' }}
                              isLoading={loading || loadingSwap}
                              onClick={swapTokens}
                              background={'#fec13b'}
                              content={
                                <>
                                  {
                                    status === "connected" ? (
                                      <span>Swap</span>
                                    ) :
                                      status === "disconnected" ? (
                                        <span>Connect Wallet</span>
                                      ) :
                                        status === "unsupported" ? (
                                          <span>Switch Network</span>
                                        ) : ''
                                  }

                                </>
                              }
                            />
                            <div className="info">
                              <span>
                                1 {fromData.address === process.env.NEXT_PUBLIC__NATIVE_ADDRESS ? 'BONE' : 'WBONE'} = 1 {fromData.address === process.env.NEXT_PUBLIC__NATIVE_ADDRESS ? 'WBONE' : 'BONE'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <ButtonCustom
                            style={{ width: '100%', padding: '10px', height: '48px' }}
                            content={
                              <span style={{
                                color: '#bdbdbd'
                              }}>No liquidity found</span>
                            }
                            isDisabled={true}
                            background={'#707070'}
                          />
                        )
                    }

                  </>
                )
              }
            </>
          }
        </div>
        <SettingModal isOpenModal={openSetting} setIsOpenModal={setOpenSetting} asyncField={handleAsyncSetting} />
      </Card>
    </div>
  );
}

export default SwapView;