import React, { useEffect, useState } from 'react';
import './style.scss'
import { Button, Collapse, message } from 'antd';
import { claimNonNativeTokens, claimTokens, getPendingNonNativeToken, getPendingToken, getPoolInfo, getPoolInfoNonNativeToken, getStakedPersonal, getStakedPersonalNonNativeToken, stakeNonNativeTokens, stakeTokens, unstakeNonNativeTokens, unstakeTokens, useCustomConnectWallet, useEthersSigner } from '@/crypto-all-in-one';
import { caculateAPR, formatNumber, generateCode } from '@/helpers';
import { ButtonCustom, InputCommon } from '@/components';
import { StakingItemType } from '@/helpers/type';
import Image from 'next/image';

const { Panel } = Collapse;

function StakingPanel({ data }: StakingItemType) {
    const { name, image, address: tokenAddress, basePrice, shortName, data_input = [] } = data;
    const [isSelected, setIsSelected] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const {
        address,
        status,
        connect,
        disconnect,
        loading: loadingWallet
    } = useCustomConnectWallet();
    const signer = useEthersSigner()
    const [inputValue, setInputValue] = useState(0);

    const [totalStaked, setTotalStaked] = useState(0);
    const [yourStake, setYourStake] = useState(0);
    const [apr, setApr] = useState(0);
    const [date, setDate] = useState('');
    const [pendingToken, setPendingToken] = useState(0);

    const [loadingStake, setLoadingStake] = useState(false);
    const [loadingUnstake, setLoadingUnstake] = useState(false);
    const [loadingClaim, setLoadingClaim] = useState(false);

    const handleClick = async () => {
        if (status === "connected") {
            disconnect();
        } else {
            connect();
        }
    }
    useEffect(() => {
        fetchPoolInfo();
        const interval = setInterval(() => {
            fetchPoolInfo();
        }, 5000);
        return () => clearInterval(interval);
    }, [name])

    useEffect(() => {
        let interval: any = null;
        if (status === "connected") {
            fetchPendingToken();
            interval = setInterval(() => {
                fetchPendingToken();
            }, 5000);
        } else {
            setPendingToken(0);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [name, status, signer])

    const fetchPoolInfo = async () => {
        try {
            if (name === 'YOUR_TOKEN_NAME') {
                const { totalStake, tokenPerSecond } = await getPoolInfo(signer) as any;
                setTotalStaked(totalStake);
                const apr = caculateAPR(tokenPerSecond, totalStake);
                setApr(parseFloat(apr));
            } else {
                const { totalStake, tokenPerSecond } = await getPoolInfoNonNativeToken(signer, name, tokenAddress) as any;
                setTotalStaked(totalStake);
                const apr = caculateAPR(tokenPerSecond, totalStake, name);
                setApr(parseFloat(apr));
            }
        } catch (error) {
            console.log('Pyswap', error)
        }
    }

    const fetchPendingToken = async () => {
        try {
            if (name === 'YOUR_TOKEN_NAME') {
                const res = await getPendingToken(signer, address as string) as number;
                setPendingToken(res);


                const { stakedData, date } = await getStakedPersonal(signer, address as string) as any;
                setYourStake(stakedData)

                setDate(date);
            } else {
                const res = await getPendingNonNativeToken(signer, address as string, name, tokenAddress) as number;
                setPendingToken(res);


                const { stakedData, date } = await getStakedPersonalNonNativeToken(signer, address as string, name, tokenAddress) as any;
                setYourStake(stakedData)

                setDate(date);
            }
        } catch (error) {
            console.log('Pyswap', error)
        }
    }

    const handleClickAuth = async () => {
        if (status === "connected") {
            disconnect();
        } else {
            connect();
        }
    }

    const handleStake = async () => {
        if (inputValue <= 0) {
            messageApi.error("Please enter a valid amount");
            return;
        }
        if (tokenAddress === process.env.NEXT_PUBLIC__NATIVE_ADDRESS) {
            try {
                setLoadingStake(true);
                const res = await stakeTokens(signer, String(inputValue)) as any;
                await res?.wait();
                setLoadingStake(false);
                await fetchPoolInfo();
                await fetchPendingToken();
                messageApi.success("Stake success");
            } catch (error) {
                setLoadingStake(false);
                console.log(error);
                messageApi.error("Stake failed");
            }
        } else {
            try {
                setLoadingStake(true);
                const res = await stakeNonNativeTokens(signer, String(inputValue), address as string, tokenAddress, name) as any;
                await res?.wait();
                setLoadingStake(false);
                await fetchPoolInfo();
                await fetchPendingToken();
                messageApi.success("Stake success");
            } catch (error) {
                setLoadingStake(false);
                console.log(error);
                messageApi.error("Stake failed");
            }
        }
    }

    const handleUnstake = async () => {
        if (inputValue <= 0) {
            messageApi.error("Please enter a valid amount");
            return;
        }
        if (tokenAddress === process.env.NEXT_PUBLIC__NATIVE_ADDRESS) {
            try {
                setLoadingUnstake(true);
                const res = await unstakeTokens(signer, String(inputValue)) as any
                await res?.wait();
                setLoadingUnstake(false);
                await fetchPoolInfo();
                await fetchPendingToken();
                messageApi.success("Unstake success");
            } catch (error) {
                setLoadingUnstake(false);
                console.log(error);
                messageApi.error("Unstake failed");
            }
        } else {
            try {
                setLoadingUnstake(true);
                const res = await unstakeNonNativeTokens(signer, String(inputValue), name, tokenAddress) as any
                await res?.wait();
                setLoadingUnstake(false);
                await fetchPoolInfo();
                await fetchPendingToken();
            } catch (error) {
                setLoadingUnstake(false);
                console.log(error);
                messageApi.error("Unstake failed");
            }
        }
    }


    const handleClaim = async () => {
        try {
            setLoadingClaim(true);
            let res: any = null;
            if (name === 'YOUR_TOKEN_NAME') {
                res = await claimTokens(signer);
            }
            else {
                res = await claimNonNativeTokens(signer, name)
            }
            await res?.wait();
            fetchPendingToken();
            fetchPoolInfo();
            setLoadingClaim(false);
        } catch (error) {
            console.log('Pyswap', error);
            setLoadingClaim(false);
        }
    }


    return (
        <div className='staking-panel'>
            <Collapse>
                <Panel
                    key={1}
                    showArrow={false}
                    header={
                        <>
                            <div onClick={() => setIsSelected(!isSelected)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="group-title" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <Image src={image} alt="" width={40} height={40} />
                                    <div className="group-name-token">
                                        Staking
                                        <span>{name}</span>
                                    </div>
                                </div>
                                <div className="group-mid" style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center', gap: '30px' }}>
                                    <div className="group">
                                        <div className="title"> Total Staked</div>
                                        <span>{formatNumber(`${totalStaked}`, null, 5)} {shortName}</span>
                                    </div>
                                    <div className="group">
                                        <div className="title">TVL(USD)</div>
                                        <span>${formatNumber(`${totalStaked * basePrice}`, null, 3)}</span>
                                    </div>
                                    <div className="group">
                                        <div className="title">APR</div>
                                        <span style={{ color: '#16B270' }}>{formatNumber(`${apr}`)}%</span>
                                    </div>
                                </div>
                                <div className="group-button">
                                    
                                </div>
                            </div>
                        </>
                    }
                >
                    <div className="staking-panel__box">
                        <div className="staking-panel__box--stake">
                            <InputCommon data={data} value={inputValue} onChangeInput={(val = 0) => setInputValue(val)} image={image} />
                            <span className='desc'>*The lock-up for your staked amount is 7 days; unstaking early incurs a 15% penalty fee.</span>
                            <div className="group-button">
                                {
                                    status === 'connected' ? (
                                        <>
                                            <Button className='btn-stake'
                                                loading={loadingStake}
                                                onClick={() => handleStake()}
                                            >Stake</Button>
                                            <Button className='btn-unstake'
                                                loading={loadingUnstake}
                                                onClick={() => handleUnstake()}
                                            >Unstake</Button>
                                        </>
                                    ) : (
                                        <ButtonCustom background="#fec13b" content={
                                            status === "connected" ? (
                                                generateCode(address as string)
                                            ) :
                                                status === "disconnected" ? (
                                                    'Connect Wallet'
                                                ) :
                                                    status === "unsupported" ? (
                                                        'Switch Network'
                                                    ) : ''
                                        } isLoading={loadingWallet} onClick={handleClick} />
                                    )
                                }
                            </div>
                        </div>
                        <div className="staking-panel__box--line"></div>
                        <div className="staking-panel__box--mid">
                            <div className="title">
                                Your staking
                            </div>
                            <div className="group-image-token-mid">
                                <Image src={image} alt="" width={20} height={20} />
                                <span>{formatNumber(`${yourStake}`, null, 5)}</span>
                            </div>
                        </div>
                        <div className="staking-panel__box--line"></div>

                        <div className="staking-panel__box--reward">
                            <div className="title">$YOUR_TOKEN_NAME to claim </div>
                            <div className="group-image-token">
                                <Image src="/tokens/logo.jpg" alt="" width={20} height={20} />
                                <span>{formatNumber(`${pendingToken}`, null, 3)}</span>

                            </div>
                            <ButtonCustom content="Claim" background="#16B270" isLoading={loadingClaim} onClick={() => handleClaim()} />
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
    );
}

export default StakingPanel;