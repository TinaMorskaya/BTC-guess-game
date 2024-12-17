import { describe, expect } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { GuessPanel, GuessPanelProps } from '../GuessPanel.tsx';
import { render, screen } from '@testing-library/react';
import { Guess } from '../../../types/types.ts';

const user = userEvent.setup();

describe('GuessPanel', () => {
    const handleGuess = vi.fn();

    const renderComponent = (props?: Partial<GuessPanelProps>) =>
        render(
            <GuessPanel
                currentGuessPrice={null}
                isWinner={false}
                handleGuess={handleGuess}
                showResult={false}
                {...props}
            />
        );

    it('should render buttons as default', async () => {
        renderComponent();

        expect(screen.getByRole('button', {name: 'Up'})).toBeEnabled();
        expect(screen.getByRole('button', {name: 'Down'})).toBeEnabled();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        expect(handleGuess).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', {name: 'Up'}));
        expect(handleGuess).toBeCalledTimes(1);
        expect(handleGuess).toBeCalledWith(Guess.Up);
    });

    it('should render Waiting for result message when currentGuessPrice is provided', () => {
        renderComponent({currentGuessPrice: 10000});

        const waiting = screen.getByRole('alert');
        expect(waiting).toHaveTextContent('Waiting for result...');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByText('You lost!')).not.toBeInTheDocument();
    });


    it('should render result message when showResult is true', () => {
        renderComponent({showResult: true});

        const result = screen.getByRole('alert');
        expect(result).toBeVisible();
        expect(result).toHaveTextContent('You lost!');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByText('Waiting for result...')).not.toBeInTheDocument();
    });

    it('should render correct message when isWinner is true', () => {
        renderComponent({showResult: true, isWinner: true});

        const result = screen.getByRole('alert');
        expect(result).toBeVisible();
        expect(result).toHaveTextContent('You won!');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByText('Waiting for result...')).not.toBeInTheDocument();
    });
});