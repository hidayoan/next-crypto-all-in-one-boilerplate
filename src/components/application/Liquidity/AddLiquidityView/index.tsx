import React, { useEffect, useState } from 'react';
import './style.scss'
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, message } from 'antd';
import { addLiquidity, gerPair, getPairData, quote, useCustomConnectWallet, useEthersSigner } from '@/crypto-all-in-one';
import { checkNativeToken } from '@/helpers';
import { ButtonCustom, InputSwap, SettingModal } from '@/components';

const list = [
    {
        key: process.env.NEXT_PUBLIC__NATIVE_ADDRESS || '',
        value: "BONE",
        link: "/tokens/bone.jpg",
    },
    {
        key: process.env.NEXT_PUBLIC__WRAP_NATIVE_ADDRESS || '',
        value: "WBONE",
        link: "/tokens/bone.jpg",
    },
];

function AddLiquidityView() {
    // router
    const router = useRouter();
    const seachParmas = useSearchParams()
    // account
    const {
        address,
        status,
        connect,
        disconnect,
    } = useCustomConnectWallet();
    const signer = useEthersSigner();
    // setting modal
    const [openSetting, setOpenSetting] = useState(false);
    const [setting, setSetting] = useState({
        slippageTolerance: 0.5,
        transactionDeadline: 2,
        autoRouterAPI: false,
        expertMode: false,
    });
    // data input
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
    // swap
    const [loadingSwap, setLoadingSwap] = useState(false);
    // pair 
    const [pairData, setPairData] = useState<any[]>([]);

    useEffect(() => {
        const token1 = seachParmas.get('token1') as string;
        const token2 = seachParmas.get('token2') as string;
        if (token1 && token2) {
            setFromData({
                address: token1 || '',
                name: '',
                amount: "0",
            });
            setToData({
                address: token2 || '',
                name: '',
                amount: "0",
            });
        }
    }, [seachParmas.get('token1'), seachParmas.get('token2')]);

    useEffect(() => {
        if (fromData.address && toData.address) {
            handleGetPair();
        } else {
            setPairData([]);
        }
    }, [fromData.address, toData.address]);
    // check and get pair
    const handleGetPair = async () => {
        const fromToken = checkNativeToken(fromData.address || '') || '';
        const toToken = checkNativeToken(toData.address || '') || '';
        const res = await gerPair(signer, fromToken, toToken);
        if (res === '0x0000000000000000000000000000000000000000') {
            setPairData([]);
        } else {
            const [token1, token2] = await getPairData(signer, res as string) as any;
            if (Array.isArray(token1) && Array.isArray(token2)) {
                if (token1[0].reserve > 0 && token2[0].reserve > 0) {
                    setPairData([token1[0], token2[0]]);
                } else {
                    setPairData([]);
                }
            } else {
                setPairData([]);
            }
        }
    }
    // handle login
    const handleClick = async () => {
        if (status === "connected") {
            disconnect();
        } else {
            connect();
        }
    }
    // handle add liquidity
    const handleAddLiquidity = async () => {
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
            const fromToken = checkNativeToken(fromData.address || '') || '';
            const toToken = checkNativeToken(toData.address || '') || '';
            const res = await addLiquidity(
                signer,
                fromToken,
                toToken,
                `${fromData.amount}`,
                `${toData.amount}`,
                setting.slippageTolerance,
                setting.transactionDeadline,
                address || '',
            ) as any;
            await res?.wait()
            setLoadingSwap(false);
            message.success('Add liquidity success');
            router.push('/liquidity');
        } catch (error) {
            setLoadingSwap(false);
            console.log(error);
        }
    };

    const caculateAmount = async (type: string, val: string) => {
        try {
            const pairDataFrom = pairData.find((item) => item.address?.toLowerCase() === checkNativeToken(fromData.address)?.toLowerCase());
            const pairDataTo = pairData.find((item) => item.address?.toLowerCase() === checkNativeToken(toData.address)?.toLowerCase());
            if (type === 'from') {
                if (fromData.address === toData.address) {
                    setToData({
                        ...toData,
                        amount: val,
                    });
                } else {
                    if (pairData.length > 0) {
                        const amount = await quote(signer, `${val}`, `${pairDataFrom.reserve}`, `${pairDataTo.reserve}`) as string;
                        setToData({
                            ...toData,
                            amount,
                        });
                    } else {
                    }
                }
            } else {
                if (fromData.address === toData.address) {
                    setFromData({
                        ...fromData,
                        amount: val,
                    });
                } else {
                    if (pairData.length > 0) {
                        const amount = await quote(signer, `${val}`, `${pairDataTo.reserve}`, `${pairDataFrom.reserve}`) as string;
                        setFromData({
                            ...fromData,
                            amount,
                        });
                    } else {
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAsyncSetting = (formData: any) => {
        const newSetting = { ...setting, ...formData };
        setSetting(newSetting);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
            <Card 
                title={
                   <div>
                    <h1>
                        Add Liquidity
                    </h1>
                    <span style={{whiteSpace: 'normal'}}>
                        Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
                    </span>
                   </div>
                }
                style={{ width: 700 }}
            >
                    <InputSwap
                        list={list}
                        data={fromData}
                        asyncData={(val) => {
                            setFromData({
                                ...fromData,
                                ...val,
                            });
                            if (val.amount) {
                                caculateAmount('from', val.amount);
                            }
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <h1>+</h1>
                    </div>
                    <InputSwap
                        list={list}
                        data={toData}
                        asyncData={(val) => {
                            setToData({
                                ...toData,
                                ...val,
                            });
                            if (val.amount) {
                                caculateAmount('to', val.amount);
                            }
                        }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
                        <div className="slip-percent">
                            <div className="slip">
                                Slippage Tolerance:
                            </div>
                            <div className="percent">
                                {setting.slippageTolerance}%
                            </div>
                        </div>
                        <ButtonCustom className="setting" onClick={() => setOpenSetting(true)} content="Setting" />
                    </div>
                    <div className="addliquidity-border__content--button">
                        <ButtonCustom
                            style={{ width: '100%', height: '50px'}}
                            padding="10px"
                            isDisabled={!toData.address || !fromData.address || !parseFloat(fromData.amount) || !parseFloat(toData.amount)}
                            onClick={handleAddLiquidity}
                            content={
                                <>
                                    {
                                        status === "connected" ? (
                                            <span>
                                                Add Liquidity
                                            </span>
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
                            isLoading={loadingSwap}
                        />
                    </div>
                <SettingModal isOpenModal={openSetting} setIsOpenModal={setOpenSetting} asyncField={handleAsyncSetting} />
            </Card>
        </div>
    );
}

export default AddLiquidityView;