import { afterEach, describe, expect, vi } from 'vitest';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { PlayerProvider, PlayerContext } from '../PlayerContext.tsx';

describe('PlayerContext', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
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
        expect(screen.getByTestId('score')).toHaveTextContent('0');
        expect(typeof screen.getByTestId('playerId').textContent).toBe('string');
        expect(screen.getByTestId('playerId').textContent).toHaveLength(36);
    });

    it('sets and gets playerData from localStorage', () => {
        getItemSpy.mockReturnValue(JSON.stringify({playerId: 'test-player-id', score: 1}));
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
                    <button onClick={() => context.decreaseScore()}>
                        Decrease Score By 1
                    </button>
                </>
            );
        };

        render(
            <PlayerProvider>
                <TestComponent/>
            </PlayerProvider>
        );

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id');
        expect(screen.getByTestId('score')).toHaveTextContent('1');

        act(() => {
            screen.getByRole('button', {name: 'Increase Score By 1'}).click();
        });

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id')
        expect(setItemSpy).toHaveBeenCalledWith('playerData', JSON.stringify({playerId: 'test-player-id', score: 2}));

        act(() => {
            screen.getByRole('button', {name: 'Decrease Score By 1'}).click();
        });

        expect(screen.getByTestId('playerId')).toHaveTextContent('test-player-id')
        expect(setItemSpy).toHaveBeenCalledWith('playerData', JSON.stringify({playerId: 'test-player-id', score: 1}));

    });
});