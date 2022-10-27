import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { WalletModalContext } from './useWalletModal.js';
import type { WalletModalProps } from './WalletModal.js';
import { WalletModal } from './WalletModal.js';

export interface WalletModalProviderProps extends WalletModalProps {
    children: ReactNode;
    fractalClick: (() => void) | undefined;
}

export const WalletModalProvider: FC<WalletModalProviderProps> = ({ children, fractalClick, ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <WalletModalContext.Provider
            value={{
                visible,
                setVisible,
                fractalClick,
            }}
        >
            {children}
            {visible && <WalletModal {...props} />}
        </WalletModalContext.Provider>
    );
};
