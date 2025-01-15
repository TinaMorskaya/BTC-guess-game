import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import { GuessPredictionContainer } from '../GuessPredictionContainer.tsx';
import { useGuess, UseGuessProps } from '../../../hooks/useGuess.tsx';
import { Guess, GuessResult } from '../../../types/types.ts';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';
import { useBTCPriceContext } from '../../../hooks/useBTCPriceContext.tsx';

vi.mock('../../../hooks/usePlayerContext');
vi.mock('../../../hooks/useBTCPriceContext');
vi.mock('../../../hooks/useGuess');

describe('GuessPredictionContainer', () => {
    const mockUseGuess = useGuess as Mock;
    const mockUsePlayerContext = usePlayerContext as Mock;
    const mockUseBTCPriceContext = useBTCPriceContext as Mock;
    const increaseScore = vi.fn();
    const decreaseScore = vi.fn();
    const handlers: UseGuessProps = {
        onResult: vi.fn(),
        btcPrice: 0
    };

    const renderComponent = () => {
        return render(
            <GuessPredictionContainer/>
        );
    }

    beforeEach(() => {
        mockUseGuess.mockImplementation((props: UseGuessProps) => {
            handlers.onResult = props.onResult;
            handlers.btcPrice = props.btcPrice;
            return {
                handleGuess: vi.fn(),
                currentGuessPrice: null,
                currentGuess: null
            };
        });
        mockUsePlayerContext.mockReturnValue({increaseScore, decreaseScore});
        mockUseBTCPriceContext.mockReturnValue({btcPrice: null});
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.useRealTimers();
    });

    it('should render GuessPanel and LastGuess components with initial state', () => {
        renderComponent();

        expect(screen.getByRole('button', {name: 'Up'})).toBeEnabled();
        expect(screen.getByRole('button', {name: 'Down'})).toBeEnabled();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should handle won guess result by showing alert and result, and clearing alert after 5 seconds', () => {
        vi.useFakeTimers();
        renderComponent();

        expect(increaseScore).not.toHaveBeenCalled();

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 6, guess: Guess.Up, isWinner: true};
        act(() => {
            handlers.onResult(result);
        });

        expect(increaseScore).toHaveBeenCalledTimes(1);
        expect(within(screen.getByRole('alert')).getByText('You won!'));
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByText('up')).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.getByText('6')).toBeVisible();

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(within(screen.getByRole('alert')).getByText('You won!'));

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('up')).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
        expect(screen.getByText('6')).toBeVisible();
    });

    it('should handle lost guess result by showing alert and result, and clearing alert after 5 seconds', () => {
        vi.useFakeTimers();
        renderComponent();

        expect(decreaseScore).not.toHaveBeenCalled();

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 6, guess: Guess.Down, isWinner: false};
        act(() => {
            handlers.onResult(result);
        });

        expect(decreaseScore).toHaveBeenCalledTimes(1);
        expect(within(screen.getByRole('alert')).getByText('You lost!'));
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByText('down')).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.getByText('6')).toBeVisible();

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(within(screen.getByRole('alert')).getByText('You lost!'));

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('down')).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
        expect(screen.getByText('6')).toBeVisible();
    });

    it('should clear previous result timeout when new result is set', () => {
        vi.useFakeTimers();
        renderComponent();

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 6, guess: Guess.Up, isWinner: true};
        act(() => {
            handlers.onResult(result);
        });

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(within(screen.getByRole('alert')).getByText('You won!'));

        const nextResult: GuessResult = {guessPrice: 2, resolvedPrice: 1, guess: Guess.Up, isWinner: false};
        act(() => {
            handlers.onResult(nextResult);
        });

        // Show the new result
        expect(within(screen.getByRole('alert')).getByText('You lost!'));

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // After 5 seconds from the previous result, the alert should still be visible and show the new result
        expect(within(screen.getByRole('alert')).getByText('You lost!'));

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        // After 5 seconds from the new result, the alert should be cleared
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});