import React, { useEffect, useState } from 'react';
import './style.scss'
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { balanceOfPair, getAllPairs, useEthersSigner } from '@/crypto-all-in-one';
import { BalancePair, ButtonCustom } from '@/components';
import { Card, Col, Row } from 'antd';

function LiquidityView() {
    const router = useRouter();
    const signer = useEthersSigner();
    const { address } = useAccount();
    const [pairs, setPairs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllPairData();
    }, [address])

    const getAllPairData = async () => {
        try {
            setLoading(true);
            const data = await getAllPairs(signer) as string[];
            await checkHasBalance(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const checkHasBalance = async (pairs: string[]) => {
        try {
            const arr = [];
            for (let i = 0; i < pairs.length; i++) {
                const balancePairVal = await balanceOfPair(signer, pairs[i], address as string) as number
                if (balancePairVal > 0) {
                    arr.push(pairs[i]);
                }
            }
            setPairs(arr);
        } catch (error) {
            console.log(error);
            setPairs([]);
        }
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', }}>
            <div className="liquidity-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: "100%" }}>
                <div className="liquidity-main__content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: "100%", gap: '20px' }}>
                    <h1 className="liquidity-main__content--title">
                        Your Liquidity
                    </h1>
                    <div className="liquidity-main__content--button">
                        <ButtonCustom content="Add Liquidity" background="#16B270"
                            onClick={() => router.push('/liquidity/add-liquidity')}
                        />
                    </div>
                </div>
                <Row gutter={16} style={{width: '100%'}}>
                    {
                        loading ? (
                            <Col span={8}>
                                <Card loading={true} style={{ width: '100%' }} />
                            </Col>
                        ) : (
                            <>

                                {
                                    pairs && pairs.length > 0 ? (
                                        <>
                                            {
                                                pairs.map((pair, index) => (
                                                    <Col span={8} key={pair}>
                                                        <Card title={pair} style={{ width: '100%' }}>
                                                            <BalancePair pair={pair} />
                                                        </Card>
                                                    </Col>
                                                ))
                                            }
                                        </>
                                    )
                                        : (
                                            <h1 style={{ textAlign: 'center', color: '#fff' }}>You don&apos;t have any liquidity yet</h1>
                                        )
                                }
                            </>
                        )
                    }
                </Row>
            </div>
        </div>
    );
}

export default LiquidityView;