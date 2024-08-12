export interface GuessButtonsProps {
    onGuess: (guess: 'up' | 'down') => void;
    disabled: boolean;
}

export const GuessButtons = ({onGuess, disabled}: GuessButtonsProps) =>
    <div className='buttons-container'>
        <button onClick={() => onGuess('up')} disabled={disabled}>
            Up
        </button>
        <button onClick={() => onGuess('down')} disabled={disabled}>
            Down
        </button>
    </div>