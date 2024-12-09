import { useContext } from 'react';
import { BTCPriceContext } from '../contexts/BTCPriceContext';

export const useBTCPriceContext = () => {
    const context = useContext(BTCPriceContext);
    if (context === undefined) {
        throw new Error('useBTCPriceContext must be used within a BTCPriceProvider');
    }
    return context;
};