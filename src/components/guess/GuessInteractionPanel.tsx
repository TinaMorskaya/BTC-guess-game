import { GuessButtons } from './GuessButtons.tsx';
import { Guess } from '../../types.ts';

export interface GuessUIProps {
    currentGuessPrice: number | null;
    isWinner: boolean;
    handleGuess: (guess: Guess) => void;
    showResult: boolean;
}

export const GuessInteractionPanel = (
    {
        currentGuessPrice,
        isWinner,
        handleGuess,
        showResult,
    }: GuessUIProps) => {
    return (
        <section className='guess-ui flex-column box'>
            {!currentGuessPrice && !showResult &&
                <GuessButtons onGuess={handleGuess}/>
            }
            {currentGuessPrice &&
                <section className='guess-message'>
                    Waiting for result...
                </section>
            }
            {showResult &&
                <section role='alert'
                         className={`guess-message ${isWinner ? 'correct-answer' : 'wrong-answer'}`}>
                    You {isWinner ? 'won' : 'lost'}!
                </section>
            }
        </section>
    )
}