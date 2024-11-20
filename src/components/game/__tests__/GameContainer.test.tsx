import { afterEach, describe, expect, Mock, vi } from 'vitest';
import { GameContainer } from '../GameContainer.tsx';
import { render, screen } from '@testing-library/react';
import { useBTCPriceContext } from '../../../hooks/useBTCPriceContext.tsx';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';

vi.mock('../../../hooks/useBTCPriceContext');
vi.mock('../../../hooks/usePlayerContext');

describe('GameContainer', () => {
    const mockUseBTCPriceContext = useBTCPriceContext as Mock;
    const mockUsePlayerContext = usePlayerContext as Mock;

    beforeEach(() => {
        mockUsePlayerContext.mockReturnValue({score: 1});
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const renderComponent = () =>
        render(
            <GameContainer/>
        );

    it('should render loading when btcPrice is null', () => {
        mockUseBTCPriceContext.mockReturnValue({btcPrice: null, btcWebSocketStatus: 'loading'});
        renderComponent();

        expect(mockUseBTCPriceContext).toHaveBeenCalled();
        expect(screen.getByText('Loading bitcoin price...')).toBeVisible();
        expect(screen.getByText('Status: loading')).toBeVisible();
    });

    it('should render GameContainer', () => {
        mockUseBTCPriceContext.mockReturnValue({btcPrice: 5, btcWebSocketStatus: 'ready'});
        renderComponent();

        expect(mockUseBTCPriceContext).toHaveBeenCalled();
        expect(screen.getByLabelText('Game description')).toBeVisible();
        expect(screen.getByLabelText('Game')).toBeVisible();
        expect(screen.queryByText('ready')).not.toBeInTheDocument();
    });
});