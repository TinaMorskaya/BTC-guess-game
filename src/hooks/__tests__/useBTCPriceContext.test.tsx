import { describe, expect } from 'vitest';
import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { BTCPriceProvider } from '../../contexts/BTCPriceContext.tsx';
import { useBTCPriceContext } from '../useBTCPriceContext.tsx';

describe('useBTCPriceContext', () => {
    it('returns context values when used within BTCPriceProvider', () => {
        const wrapper = ({children}: { children: ReactNode }) =>
            <BTCPriceProvider>{children}</BTCPriceProvider>;
        const {result} = renderHook(() => useBTCPriceContext(), {wrapper});

        const {btcPrice, btcWebSocketStatus} = result.current;
        expect(btcPrice).toBe(null);
        expect(btcWebSocketStatus).toBe('');
    });

    it('throws error when used outside of BTCPriceProvider', () => {
        renderHook(() => {
            try {
                useBTCPriceContext()
            } catch (error) {
                expect(error).toEqual(Error('useBTCPriceContext must be used within a BTCPriceProvider'));
            }
        });
    });
});