import { describe, expect } from 'vitest';
import { LastGuess, LastGuessProps } from '../LastGuess.tsx';
import { render, screen } from '@testing-library/react';
import { Guess } from '../../../types.ts';

describe('LastGuess', () => {
    const result = {guess: Guess.Up, resolvedPrice: 6, guessPrice: 5, isWinner: true};
    const renderComponent = (props?: Partial<LastGuessProps>) =>
        render(
            <LastGuess
                currentGuessPrice={null}
                currentGuess={null}
                result={null}
                {...props}
            />
        );
    it('should render LastGuess with default state', () => {
        renderComponent();

        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.queryByText('null')).not.toBeInTheDocument();
        expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });

    it('should render currentGuessPrice, currentGuess  and no result when all state are provided', () => {
        renderComponent({currentGuessPrice: 7, currentGuess: Guess.Down, result});

        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.getByText('7')).toBeVisible();
        expect(screen.getByText('down')).toBeVisible();
        expect(screen.queryByText('6')).not.toBeInTheDocument();
        expect(screen.queryByText('5')).not.toBeInTheDocument();
        expect(screen.queryByText('up')).not.toBeInTheDocument();
        expect(screen.queryByText('null')).not.toBeInTheDocument();
        expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });

    it('should render result only when currentGuessPrice and currentGuess are not provided', () => {
        renderComponent({result: {guess: Guess.Up, resolvedPrice: 6, guessPrice: 5, isWinner: true}});

        expect(screen.getByRole('heading', {name: 'Your guess'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Original price'})).toBeVisible();
        expect(screen.getByRole('heading', {name: 'Actual price'})).toBeVisible();
        expect(screen.getByText('5')).toBeVisible();
        expect(screen.getByText('up')).toBeVisible();
        expect(screen.getByText('6')).toBeVisible();
    });
});