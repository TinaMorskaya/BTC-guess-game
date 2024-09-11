import { afterEach, describe, expect, Mock, vi } from 'vitest';

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { GameProvider, GameContext } from '../GameContext';
import { useBTCCostUSD } from '../../hooks/useBTCCostUSD.tsx';

vi.mock('../../hooks/useBTCCostUSD');

describe('GameProvider', () => {
    const mockUseBTCCostUSD = useBTCCostUSD as Mock;
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    beforeEach(() => {
        mockUseBTCCostUSD.mockReturnValue({
            price: 5,
            date: new Date('2023-01-01T00:00:00Z')
        });
        getItemSpy.mockReturnValue(JSON.stringify('test-player-id-1'));
    });

    afterEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    it('provides the correct context values', () => {
        const TestComponent = () => {
            const context = React.useContext(GameContext);
            if (!context) {
                return null;
            }
            return (
                <div>
                    <span data-testid="btcPrice">{context.btcPrice}</span>
                    <span data-testid="btcPriceDate">{context.btcPriceDate?.toISOString()}</span>
                    <span data-testid="playerId">{context.playerId}</span>
                </div>
            );
        };

        render(
            <GameProvider>
                <TestComponent/>
            </GameProvider>
        );

        expect(screen.getByTestId('btcPrice').textContent).toBe('5');
        expect(screen.getByTestId('btcPriceDate').textContent).toBe('2023-01-01T00:00:00.000Z');
        expect(screen.getByTestId('playerId').textContent).toBe('test-player-id-1');
    });

    it('sets and gets playerId from localStorage', () => {
        const TestComponent = () => {
            const context = React.useContext(GameContext);
            if (!context) {
                return null;
            }
            return (
                <>
                    <p data-testid='playerId'>{context.playerId}</p>
                    <button onClick={() => context.setPlayerId('test-player-id-2')}>
                        Set Player ID
                    </button>
                </>
            );
        };

        render(
            <GameProvider>
                <TestComponent/>
            </GameProvider>
        );

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id-1');

        act(() => {
            screen.getByText('Set Player ID').click();
        });

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id-2')
        expect(setItemSpy).toHaveBeenCalledWith('playerId', JSON.stringify('test-player-id-2'));
    });
});