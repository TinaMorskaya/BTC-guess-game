import { Guess } from '../../types/types.ts';

export interface GuessButtonsProps {
    onGuess: (guess: Guess) => void;
}

export const GuessButtons = ({onGuess}: GuessButtonsProps) =>
    <div className='guess-panel__buttons'>
        <button className='box guess-panel__button' onClick={() => onGuess(Guess.Up)}>
            Up
        </button>
        <button className='box guess-panel__button' onClick={() => onGuess(Guess.Down)}>
            Down
        </button>
    </div>