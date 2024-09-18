import { afterEach, describe, expect, Mock, vi } from 'vitest';
import { GameContainer } from '../GameContainer.tsx';
import { render, screen } from '@testing-library/react';
import { useBTCCostUSD } from '../../hooks/useBTCCostUSD.tsx';
import { useGameContext } from '../../hooks/useGameContext.tsx';

vi.mock('../../hooks/useBTCCostUSD');
vi.mock('../../hooks/useGameContext');

describe('GameContainer', () => {
    const mockUseBTCCostUSD = useBTCCostUSD as Mock;
    const mockUseGameContext = useGameContext as Mock;

    beforeEach(() => {
        mockUseGameContext.mockReturnValue({score: 0, increaseScore: vi.fn()});
    });

    afterEach(() => {
        mockUseBTCCostUSD.mockReset();
        mockUseGameContext.mockReset();
    });

    const renderComponent = () =>
        render(
            <GameContainer/>
        );

    it('should render loading when btcPrice is null', () => {
        mockUseBTCCostUSD.mockReturnValue({price: null});
        renderComponent();

        expect(mockUseBTCCostUSD).toHaveBeenCalled();
        expect(screen.getByText('Loading...')).toBeVisible();
    });

    it('should render GameContainer', () => {
        mockUseBTCCostUSD.mockReturnValue({price: 5});
        renderComponent();

        expect(mockUseBTCCostUSD).toHaveBeenCalled();
        expect(screen.getByText('Current price: 5')).toBeVisible();
    });
});