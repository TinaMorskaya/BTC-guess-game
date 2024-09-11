import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import { GuessContainer } from '../GuessContainer';
import { useGuess } from '../../hooks/useGuess';
import { useGameContext } from '../../hooks/useGameContext';
import { Guess, GuessResult } from '../../types';

vi.mock('../../hooks/useGuess');
vi.mock('../../hooks/useGameContext');

describe('GuessContainer', () => {
    const mockUseGuess = useGuess as Mock;
    const mockUseGameContext = useGameContext as Mock;

    beforeEach(() => {
        mockUseGameContext.mockReturnValue({btcPrice: 5});
        mockUseGuess.mockReturnValue({
            score: 0,
            currentGuessPrice: null,
            currentGuess: null,
            handleGuess: vi.fn(),
            didWin: vi.fn().mockReturnValue(true),
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should render GuessUI with correct default props', () => {
        render(<GuessContainer/>);

        expect(mockUseGameContext).toHaveBeenCalled();
        expect(mockUseGuess).toHaveBeenCalled();

        expect(screen.getByRole('button', {name: 'Up'})).toBeEnabled();
        expect(screen.getByRole('button', {name: 'Down'})).toBeEnabled();
        expect(screen.getByText('Score: 0')).toBeVisible();
        expect(screen.queryByText('Waiting for result... Your guess:')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('should handle guess result correctly', () => {
        render(<GuessContainer/>);

        const result: GuessResult = {guessPrice: 5, resolvedPrice: 5, guess: Guess.Up};
        act(() => {
            mockUseGuess.mock.calls[0][0].onResult(result);
        });

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You won! You guessed that the price would go up. The original price was 5 and the final price was 5.'
        ));
    });
});