import React, { createContext } from 'react';
import { useBTCCostUSD } from '../hooks/useBTCCostUSD.tsx';

export interface BTCPriceContextType {
    btcPrice: number | null;
    btcWebSocketStatus: string;
}

export const BTCPriceContext = createContext<BTCPriceContextType | undefined>(undefined);

export const BTCPriceProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {price, status} = useBTCCostUSD();

    return (
        <BTCPriceContext.Provider value={{
            btcPrice: price,
            btcWebSocketStatus: status,
        }}>
            {children}
        </BTCPriceContext.Provider>
    );
};