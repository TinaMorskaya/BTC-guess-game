import { GuessButtons, GuessButtonsProps } from '../GuessButtons.tsx';
import { render, screen } from '@testing-library/react';
import { Guess } from '../../../types.ts';

describe('GuessButtons', () => {
    const onGuess = vi.fn();
    const renderComponent = (props?: Partial<GuessButtonsProps>) =>
        render(<GuessButtons onGuess={onGuess} {...props}/>);

    it('should render buttons', () => {
        renderComponent();

        const upButton = screen.getByRole('button', {name: 'Up'});
        const downButton = screen.getByRole('button', {name: 'Down'});

        expect(upButton).toBeEnabled();
        expect(downButton).toBeEnabled();
    });

    it('should call onGuess with Guess.Up', () => {
        renderComponent();

        const upButton = screen.getByRole('button', {name: 'Up'});
        upButton.click();

        expect(onGuess).toHaveBeenCalledWith(Guess.Up);
    });

    it('should call onGuess with Guess.Down', () => {
        renderComponent();

        const downButton = screen.getByRole('button', {name: 'Down'});
        downButton.click();

        expect(onGuess).toHaveBeenCalledWith(Guess.Down);
    });
});