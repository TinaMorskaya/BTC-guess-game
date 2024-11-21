import { afterEach, describe, expect, Mock, vi } from 'vitest';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';
import { Game } from '../Game.tsx';
import { render, screen } from '@testing-library/react';
import { useBTCPriceContext } from '../../../hooks/useBTCPriceContext.tsx';

vi.mock('../../../hooks/useBTCPriceContext');
vi.mock('../../../hooks/usePlayerContext');

describe('Game', () => {
    const mockUseBTCPriceContext = useBTCPriceContext as Mock;
    const mockUsePlayerContext = usePlayerContext as Mock;


    beforeEach(() => {
        mockUsePlayerContext.mockReturnValue({score: 1});
        mockUseBTCPriceContext.mockReturnValue({btcPrice: null, btcWebSocketStatus: ''});
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const renderComponent = () =>
        render(<Game/>);

    it('should render Game and Game description', () => {
        renderComponent();

        expect(screen.getByRole('heading', {name: 'BitPredict: 60-Second Bitcoin Price Challenge'})).toBeVisible();
        expect(screen.getByText('Predict Bitcoin\'s price movement in this quick-fire guessing game. ' +
            'Choose \'Up\' or \'Down\' for the BTC/USD price in the next minute. Correct guesses earn you a point, ' +
            'wrong ones cost you. Watch the live price, time your predictions, and see how high you can score!'))
            .toBeVisible();
        expect(screen.getByText('Current price:')).toBeVisible();
        expect(screen.getByText('Your score:')).toBeVisible();
        expect(screen.getByRole('button', {name: 'Up'})).toBeVisible();
        expect(screen.getByRole('button', {name: 'Down'})).toBeVisible();
    });
});