import { GuessButtons } from './GuessButtons.tsx';
import { Guess } from '../../types.ts';

export interface GuessPanelProps {
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
    }: GuessPanelProps) => (
    <section className='guess-panel flex-column box'>
        {!currentGuessPrice && !showResult &&
            <GuessButtons onGuess={handleGuess}/>
        }
        {currentGuessPrice && !showResult &&
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
);