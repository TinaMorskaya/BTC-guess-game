import { Guess } from '../types.ts';

export interface GuessButtonsProps {
    onGuess: (guess: Guess) => void;
}

export const GuessButtons = ({onGuess}: GuessButtonsProps) =>
    <div className='buttons-container'>
        <button onClick={() => onGuess(Guess.Up)}>
            Up
        </button>
        <button onClick={() => onGuess(Guess.Down)}>
            Down
        </button>
    </div>