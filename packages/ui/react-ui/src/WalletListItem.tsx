import { WalletReadyState } from '@solana/wallet-adapter-base';
import { Wallet } from '@solana/wallet-adapter-react';
import React, { FC, MouseEventHandler } from 'react';
import { Button } from './Button.js';
import { WalletIcon } from './WalletIcon.js';

export interface WalletListItemProps {
    handleClick: MouseEventHandler<HTMLButtonElement>;
    tabIndex?: number;
    wallet: Wallet;
}

export const WalletListItem: FC<WalletListItemProps> = ({ handleClick, tabIndex, wallet }) => {
    return (
        <li>
            <Button onClick={handleClick} startIcon={<WalletIcon wallet={wallet} />} tabIndex={tabIndex}>
                {wallet.adapter.name}
                {wallet.readyState === WalletReadyState.Installed && <span>Detected</span>}
            </Button>
        </li>
    );
};
