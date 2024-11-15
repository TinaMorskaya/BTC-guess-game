import { afterEach, describe, expect, vi } from 'vitest';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { PlayerProvider, PlayerContext } from '../GameProvider.tsx';

describe('GameProvider', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    beforeEach(() => {
        vi.setSystemTime(new Date('2023-01-01'));
    });

    afterEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    it('provides the correct default values', () => {
        const TestComponent = () => {
            const context = React.useContext(PlayerContext);
            if (!context) {
                return null;
            }
            return (
                <div>
                    <span data-testid='score'>{context.score}</span>
                    <span data-testid='playerId'>{context.playerId}</span>
                </div>
            );
        };

        render(
            <PlayerProvider>
                <TestComponent/>
            </PlayerProvider>
        );

        expect(setItemSpy).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId('score').textContent).toBe('0');
        expect(typeof screen.getByTestId('playerId').textContent).toBe('string');
    });

    it('sets and gets playerData from localStorage', () => {
        getItemSpy.mockReturnValue(JSON.stringify({playerId: 'test-player-id', score: 0}));
        const TestComponent = () => {
            const context = React.useContext(PlayerContext);
            if (!context) {
                return null;
            }
            return (
                <>
                    <p data-testid='playerId'>{context.playerId}</p>
                    <p data-testid='score'>{context.score}</p>
                    <button onClick={() => context.increaseScore()}>
                        Increase Score By 1
                    </button>
                </>
            );
        };

        render(
            <PlayerProvider>
                <TestComponent/>
            </PlayerProvider>
        );

        expect(typeof screen.getByTestId('playerId').textContent).toBe('string');
        expect(screen.getByTestId('score').textContent).toBe('0');

        act(() => {
            screen.getByText('Increase Score By 1').click();
        });

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id')
        expect(setItemSpy).toHaveBeenCalledWith('playerData', JSON.stringify({playerId: 'test-player-id', score: 1}));
    });
});