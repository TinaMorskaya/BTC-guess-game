import { GuessButtons } from './GuessButtons.tsx';
import { Guess } from '../../types.ts';

export interface GuessUIProps {
    currentGuessPrice: number | null;
    isWinner: boolean;
    handleGuess: (guess: Guess) => void;
    showResult: boolean;
}

export const GuessPanel = (
    {
        currentGuessPrice,
        isWinner,
        handleGuess,
        showResult,
    }: GuessUIProps) => {
    return (
        <section className='guess-panel flex-column box'>
            {!currentGuessPrice && !showResult &&
                <GuessButtons onGuess={handleGuess}/>
            }
            {currentGuessPrice &&
                <section className='guess-panel__message' role='alert'>
                    Waiting for result...
                </section>
            }
            {showResult &&
                <section role='alert' className={`guess-panel__message 
                    guess-panel__message--${isWinner ? 'correct-answer' : 'wrong-answer'}`}>
                    You {isWinner ? 'won' : 'lost'}!
                </section>
            }
        </section>
    )
}