import { useContext } from 'react';
import { BTCPriceContext } from '../context/BTCPriceProvider.tsx';

export const useBTCPriceContext = () => {
    const context = useContext(BTCPriceContext);
    if (context === undefined) {
        throw new Error('useBTCPriceContext must be used within a BTCPriceProvider');
    }
    return context;
};