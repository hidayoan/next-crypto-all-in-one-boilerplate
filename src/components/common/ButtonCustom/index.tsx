import React from 'react';
import './style.scss'
import { Button } from 'antd';
import { ButtonCustomType } from '@/helpers/type';

function ButtonCustom({
    isDisabled,
    content,
    onClick,
    isLoading,
    background,
    padding,
    className,
    style
}: ButtonCustomType) {
    return (
        <div className='button-custom'>
            <Button disabled={isDisabled} onClick={onClick} loading={isLoading} className='btn-custom' style={{ background: `${background}`, padding: padding, ...style }}>
                {
                    content
                }
            </Button>
        </div>
    );
}

export default ButtonCustom;