import { describe, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Guess } from '../../types.ts';
import { GuessResultMessage, GuessResultMessageProps } from '../GuessResultMessage.tsx';

describe('GuessResultMessage', () => {
    const result = {
        guess: Guess.Up,
        resolvedPrice: 8000,
        guessPrice: 9000,
        isWinner: false,
    };

    const renderComponent = (props?: Partial<GuessResultMessageProps>) => {
        render(
            <GuessResultMessage
                result={result}
                {...props}
            />
        );
    }

    it('should render correct message when user lost', () => {
        renderComponent();

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You lost! You guessed that the price would go up. The original price was 9000 and the final price was 8000.'
        ));
    });

    it('should render correct message when user won', () => {
        renderComponent({result: {...result, guess: Guess.Down, isWinner: true}});

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You won! You guessed that the price would go down. The original price was 9000 and the final price was 8000.'
        ));
    });
});