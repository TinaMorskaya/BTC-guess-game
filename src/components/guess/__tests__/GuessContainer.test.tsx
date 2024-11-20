import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import { GuessPredictionContainer, GuessContainerProps } from '../GuessPredictionContainer.tsx';
import { useGuess } from '../../../hooks/useGuess.tsx';
import { Guess, GuessResult } from '../../../types.ts';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';

vi.mock('../../hooks/useGuess');
vi.mock('../../hooks/useGameContext');

describe('GuessContainer', () => {
    const mockUseGuess = useGuess as Mock;
    const mockUseGameContext = usePlayerContext as Mock;

    const renderComponent = (props?: Partial<GuessContainerProps>) => {
        return render(
            <GuessPredictionContainer btcPrice={5} {...props}/>
        );
    }

    beforeEach(() => {
        mockUseGuess.mockReturnValue({
            score: 0,
            currentGuessPrice: null,
            currentGuess: null,
            handleGuess: vi.fn(),
            didWin: vi.fn().mockReturnValue(true),
        });
        mockUseGameContext.mockReturnValue({score: 1, increaseScore: vi.fn()});
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.useRealTimers();
    });

    it('should render GuessUI with correct default props and pass correct btcPrice to useGuess', () => {
        renderComponent();

        const {btcPrice} = mockUseGuess.mock.calls[0][0];
        expect(btcPrice).toBe(5);

        expect(screen.getByRole('button', {name: 'Up'})).toBeEnabled();
        expect(screen.getByRole('button', {name: 'Down'})).toBeEnabled();
        expect(screen.getByText('Score: 1')).toBeVisible();
        expect(screen.queryByText('Waiting for result... Your guess:')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('should handle guess result by showing alert and clearing it after 5 seconds', () => {
        vi.useFakeTimers();
        renderComponent();

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 6, guess: Guess.Up, isWinner: true};
        act(() => {
            mockUseGuess.mock.calls[0][0].onResult(result);
        });

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You won! You guessed that the price would go up. The original price was 5 and the final price was 6.'
        ));

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.getByRole('alert')).toBeVisible();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('should clear previous result timeout when new result is set', () => {
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
        renderComponent();

        const resultTimeoutId = 123;
        mockUseGuess.mock.calls[0][0].resultTimeoutRef.current = resultTimeoutId;

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 6, guess: Guess.Up, isWinner: true};
        act(() => {
            mockUseGuess.mock.calls[0][0].onResult(result);
        });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(resultTimeoutId);

        clearTimeoutSpy.mockRestore();
    });
});