import { describe, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Guess } from '../../types.ts';
import { GuessResultMessage, GuessResultMessageProps } from '../GuessResultMessage.tsx';

describe('GuessResultMessage', () => {
    const result = {
        guess: Guess.Up,
        resolvedPrice: 10000,
        guessPrice: 9000
    };

    const renderComponent = (props?: Partial<GuessResultMessageProps>) => {
        render(
            <GuessResultMessage
                result={result}
                win={false}
                {...props}
            />
        );
    }

    it('should render correct message when user lost', () => {
        renderComponent();

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You lost! You guessed that the price would go up. The original price was 9000 and the final price was 10000.'
        ));
    });

    it('should render correct message when user won', () => {
        renderComponent({win: true, result: {...result, guess: Guess.Down, guessPrice: 10000}});

        const resultAlert = screen.getByRole('alert');
        expect(resultAlert).toBeVisible();
        expect(within(resultAlert).getByText(
            'You won! You guessed that the price would go down. The original price was 10000 and the final price was 10000.'
        ));
    });
});