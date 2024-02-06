import React from 'react';
import './style.scss'
import StakingPanel from '../StakingPanel';
import { StakingItemType } from '@/helpers/type';

function StakingItem({ data }: StakingItemType) {
    return (
        <div className='staking-item'>
            <div className="staking-item-main">
                <div className="staking-item-main__box">
                    <div className="staking-item-main__box--panel">
                        <StakingPanel data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StakingItem;