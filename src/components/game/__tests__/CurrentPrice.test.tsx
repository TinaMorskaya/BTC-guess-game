import { describe, Mock, vi } from 'vitest';
import { useBTCPriceContext } from '../../../hooks/useBTCPriceContext.tsx';
import { render, screen } from '@testing-library/react';
import { CurrentPrice } from '../CurrentPrice.tsx';

vi.mock('../../../hooks/useBTCPriceContext');

describe('CurrentPrice', () => {
    const mockUseBTCPriceContext = useBTCPriceContext as Mock;

    beforeEach(() => {
        mockUseBTCPriceContext.mockReturnValue({btcPrice: null, btcWebSocketStatus: ''});
    });

    const renderComponent = () =>
        render(<CurrentPrice/>);

    it('should render current price header and NO price, when btcPrice is null', () => {
        renderComponent();

        expect(screen.getByText('Current price:')).toBeVisible();
        expect(screen.queryByText('null')).not.toBeInTheDocument();
    });

    it('should render current price header and price, when btcPrice is provided', () => {
        mockUseBTCPriceContext.mockReturnValue({btcPrice: 5, btcWebSocketStatus: ''});
        renderComponent();

        expect(screen.getByText('Current price:')).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
    });
});