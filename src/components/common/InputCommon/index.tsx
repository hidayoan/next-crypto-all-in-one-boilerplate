import React, { useState } from 'react';
import './style.scss'
import { Button, InputNumber } from 'antd';
import { useCustomBalance } from '@/crypto-all-in-one';
import { InputCommonType } from '@/helpers/type';

function InputCommon({ data, value, onChangeInput, image = "" }: InputCommonType | any) {
    const tokenAddress = data.address
    const { balance, setMaxBalanceValue } = useCustomBalance(tokenAddress as `0x${string}`, 2);
    const handleSetMaxBalance = () => {
        const val = setMaxBalanceValue();
        onChangeInput(val);
    }

    const handleChange = (value: number | null) => {
        onChangeInput(value || 0);
    }

    return (
        <div className='input-common'>
            <div className="input-common__balance">
                <span>Your balance: </span>
                <div className="group-token">
                    {
                        image ? (
                            <img src={image} alt="" />
                        ) : (
                            <>

                            </>
                        )
                    }
                    <div className="balance">
                        {balance} ${data.name}
                    </div>
                </div>
            </div>
            <div className="input-common__main">
                <div className="input">
                    <InputNumber bordered={false} controls={false} value={value} className='input-number' onChange={handleChange} />
                </div>
                <div className="button">
                    <Button className="btn-max" onClick={handleSetMaxBalance}>
                        MAX
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InputCommon;