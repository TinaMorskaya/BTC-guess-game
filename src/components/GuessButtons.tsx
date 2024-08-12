import { Guess } from '../types.ts';

export interface GuessButtonsProps {
    onGuess: (guess: Guess) => void;
    disabled: boolean;
}

export const GuessButtons = ({onGuess, disabled}: GuessButtonsProps) =>
    <div className='buttons-container'>
        <button onClick={() => onGuess(Guess.Up)} disabled={disabled}>
            Up
        </button>
        <button onClick={() => onGuess(Guess.Down)} disabled={disabled}>
            Down
        </button>
    </div>