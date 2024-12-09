import { afterEach, describe, Mock, vi } from 'vitest';
import { useBTCCostUSD } from '../../hooks/useBTCCostUSD.tsx';

vi.mock('../../hooks/useBTCCostUSD');

describe('BTCPriceContext', () => {
    const mockUseBTCCostUSD = useBTCCostUSD as Mock;

    beforeEach(() => {
        mockUseBTCCostUSD.mockReturnValue({price: null, status: 'loading'});
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('provides price and status', () => {
        const {price, status} = useBTCCostUSD();

        expect(price).toBe(null);
        expect(status).toBe('loading');
    });

    it('provides updated price and status', () => {
        mockUseBTCCostUSD.mockReturnValue({price: 5, status: 'ready'});

        const {price, status} = useBTCCostUSD();

        expect(price).toBe(5);
        expect(status).toBe('ready');
    });
});