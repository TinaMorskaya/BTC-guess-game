import { describe, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GuessPanel, GuessUIProps } from '../GuessPanel.tsx';
import { Guess } from '../../../types.ts';

describe('GuessUI', () => {
    const renderComponent = (props?: Partial<GuessUIProps>) =>
        render(
            <GuessPanel
                currentGuessPrice={null}
                result={null}
                score={0}
                handleGuess={vi.fn()}
                {...props}
            />
        );

    it('should render Score and buttons when no result and no currentGuessPrice', () => {
        renderComponent();

        expect(screen.getByRole('button', {name: 'Up'})).toBeEnabled();
        expect(screen.getByRole('button', {name: 'Down'})).toBeEnabled();
        expect(screen.getByText('Score: 0')).toBeVisible();
        expect(screen.queryByText('Waiting for result... Your guess:')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('should render Waiting for result message when currentGuessPrice and no result', () => {
        renderComponent({currentGuessPrice: 10000});

        expect(screen.getByText('Waiting for result... Your guess: 10000')).toBeVisible();
        expect(screen.queryByRole('button', {name: 'Up'})).toBeNull();
        expect(screen.queryByRole('button', {name: 'Down'})).toBeNull();
        expect(screen.getByText('Score: 0')).toBeVisible();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('should render GuessResultMessage when result and no currentGuessPrice', () => {
        renderComponent({
            result: {
                guess: Guess.Up,
                resolvedPrice: 10000,
                guessPrice: 9000,
                isWinner: false,
            },
            score: 1
        });

        const result = screen.getByRole('alert');
        expect(within(result).getByText(
            'You lost! You guessed that the price would go up. The original price was 9000 and the final price was 10000.'
        )).toBeVisible();
        expect(screen.queryByRole('button', {name: 'Up'})).toBeNull();
        expect(screen.queryByRole('button', {name: 'Down'})).toBeNull();
        expect(screen.getByText('Score: 1')).toBeVisible();
        expect(screen.queryByText('Waiting for result... Your guess:')).toBeNull();
    });
});