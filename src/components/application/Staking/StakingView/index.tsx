import React, { useEffect, useState } from 'react';
import './style.scss'
import { Tabs } from 'antd';
import { getPoolInfo, getPoolInfoNonNativeToken, useEthersSigner } from '@/crypto-all-in-one';
import { caculateAPR, formatNumber } from '@/helpers';
import StakingItem from './components/StakingItem';
const list = [
    {
        name: 'BONE',
        shortName: 'BONE',
        image: "/tokens/bone.jpg",
        address: process.env.NEXT_PUBLIC__NATIVE_ADDRESS || '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
        basePrice: 1.2,
        data_input: [
            {
                image_input: '/tokens/bone.jpg',
                name_input: 'BONE',
            }
        ]
    },
    {
        name: 'YOUR_TOKEN_NAME',
        shortName: 'YOUR_TOKEN_NAME',
        image: "/tokens/logo.jpg",
        address: process.env.NEXT_PUBLIC__MAIN_TOKEN_ADDRESS || '',
        basePrice: 1.2,
        data_input: [
            {
                image_input: '/tokens/logo.jpg',
                name_input: 'YOUR_TOKEN_NAME',
            }
        ]
    },
]

function StakingView() {
    const [tvl, tvlSet] = useState(0)
    const [apr, aprSet] = useState(0)
    const signer = useEthersSigner()

    useEffect(() => {
        const getData = async () => {
            const { aprData, tvlData } = await handleGetData();
            tvlSet(tvlData);
            aprSet(aprData);
        }
        getData();
    }, [])

    const handleGetData = async () => {
        try {
            let aprData = 0;
            let tvlData = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name === 'YOUR_TOKEN_NAME') {
                    const { totalStake, tokenPerSecond } = await getPoolInfo(signer) as any;
                    const apr = caculateAPR(tokenPerSecond, totalStake)
                    if (parseFloat(apr) > aprData) {
                        aprData = parseFloat(apr)
                    }
                    tvlData += totalStake * list[i].basePrice;
                } else {
                    const { totalStake, tokenPerSecond } = await getPoolInfoNonNativeToken(signer, list[i].name, list[i].address) as any;
                    const apr = caculateAPR(tokenPerSecond, totalStake, '1');
                    if (parseFloat(apr) > aprData) {
                        aprData = parseFloat(apr)
                    }
                    tvlData += totalStake * list[i].basePrice;
                }
            }
            return { aprData, tvlData }
        } catch (error) {
            console.log(error)
            return { aprData: 0, tvlData: 0 }
        }
    }


    return (
        <div className='staking' style={{ padding: '20px', display: 'flex',  alignItems: 'center', justifyContent: 'center' }}>
            <div className="staking-main" style={{ width: '1200px' }}>
                <div className="staking-main__infor">
                    <div className="staking-main__infor--data-staking" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div className="group-title" style={{width: '100%', marginBottom: '20px'}}>
                            <h1 className="title">
                                Staking
                            </h1>
                            <span className="desc">
                                Just stake some tokens to earn.
                                High APR, low risk.
                            </span>
                        </div>
                        <div className="group" style={{width: '45%'}}>
                            <div className="name">
                                TVL
                            </div>
                            <div className="percent">
                                ${formatNumber(`${tvl}`)}
                            </div>
                        </div>
                        <div className="group" style={{width: '45%'}}>
                            <div className="name">
                                Highest APR
                            </div>
                            <div className="percent">
                                {formatNumber(`${apr}`)}%
                            </div>
                        </div>
                    </div>
                    <div className="staking-main__infor--banner">
                        <img src="/images/bone.png" alt="" />
                    </div>
                </div>
                <div className="staking-main__tabs--content">
                    {
                        list.map((item, index) => (
                            <StakingItem data={item} key={index} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default StakingView;