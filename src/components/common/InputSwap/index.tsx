import React, { useEffect, useState } from 'react';
import './style.scss'
import { Button, InputNumber } from 'antd';
import { Balance, ButtonCustom, SelectTokenModal } from '@/components';
import { checkSymbol } from '@/crypto-all-in-one';
import { InputSwapType } from '@/helpers/type';
import Image from 'next/image';

function InputSwap({ list, data, asyncData }: InputSwapType) {
    const { address, amount, name } = data
    const [openTokenModal, setOpenTokenModal] = useState(false);

    const [max, setMax] = useState(0)
    useEffect(() => {
        if (!name && address) {
            showName(address)
        }
    }, [name])

    const showName = async (key: string) => {
        try {
            const find = list.find((item) => item.key === key)
            if (find) {
                asyncData && asyncData({ name: find.value })
            } else {
                const res = await checkSymbol(null, key)
                if (res) {
                    asyncData && asyncData({ name: res })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginBottom: '10px' }}>
            <div>
                <ButtonCustom
                    onClick={() => setOpenTokenModal(true)}
                    style={{ height: '40px' }}
                    padding='5px 10px'
                    content={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                list.find((item) => item.key === address) ? (
                                    <Image src={list.find((item) => item.key === address).link} alt="" width={24} height={24} style={{ marginRight: '10px', borderRadius: '50%' }} />
                                ) : (
                                    <Image src='/tokens/unknown.png' alt="" width={24} height={24} style={{ marginRight: '10px', borderRadius: '50%' }} />
                                )
                            }
                            <span>
                                {name}
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.6074 14.7414C12.271 15.0862 11.729 15.0862 11.3926 14.7414L8.2578 11.5294C7.7095 10.9675 8.09379 10 8.86524 10L15.1348 10C15.9062 10 16.2905 10.9675 15.7422 11.5294L12.6074 14.7414Z" fill="#572613" />
                            </svg>
                        </div>
                    } />
                <div>
                    <p className='balance-wallet'>Balance:
                        <span style={{ marginLeft: '5px' }}>
                            <Balance tokenAddress={address as `0x${string}`} onSyncBalance={(balance) => setMax(balance)} />
                        </span>
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '10px' }}>
                <InputNumber
                    style={{ flexGrow: 1, boxShadow: 'none !important' }}
                    value={amount}
                    onChange={(value) => {
                        asyncData && asyncData({ amount: value })
                    }}
                    min={0}
                    bordered={false}
                    controls={false}
                    className='input'
                />
                <div className="group-token">
                    <div className="balance">
                        <ButtonCustom
                            padding={'0px 10px'}
                            content='MAX'
                            onClick={() => {
                                asyncData && asyncData({ amount: max })
                            }}
                        />
                    </div>
                </div>
            </div>
            <SelectTokenModal
                isModalOpen={openTokenModal}
                setIsModalOpen={setOpenTokenModal}
                list={list}
                data={data}
                onChange={(item) => {
                    asyncData && asyncData({ address: item.key, name: item.value, amount: 0 })
                }}
            />
        </div>
    );
}

export default InputSwap;