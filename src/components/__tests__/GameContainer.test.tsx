import { afterEach, describe, expect, Mock, vi } from 'vitest';
import { GameContainer } from '../GameContainer.tsx';
import { render, screen } from '@testing-library/react';
import { useGameContext } from '../../hooks/useGameContext.tsx';

vi.mock('../../hooks/useGameContext');

describe('GameContainer', () => {
    const mockUseGameContext = useGameContext as Mock;

    afterEach(() => {
        mockUseGameContext.mockReset();
    });

    const renderComponent = () =>
        render(
            <GameContainer/>
        );

    it('should render loading when btcPrice is null', () => {
        mockUseGameContext.mockReturnValue({btcPrice: null});
        renderComponent();

        expect(mockUseGameContext).toHaveBeenCalled();
        expect(screen.getByText('Loading...')).toBeVisible();
    });

    it('should render GameContainer', () => {
        mockUseGameContext.mockReturnValue({btcPrice: 5});
        renderComponent();

        expect(mockUseGameContext).toHaveBeenCalled();
        expect(screen.getByText('Current price: 5')).toBeVisible();
    });
});