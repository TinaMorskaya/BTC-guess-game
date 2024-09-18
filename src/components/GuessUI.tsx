import { GuessButtons } from './GuessButtons.tsx';
import { Score } from './Score.tsx';
import { Guess, GuessResult } from '../types.ts';
import { GuessResultMessage } from './GuessResultMessage.tsx';

export interface GuessUIProps {
    currentGuessPrice: number | null;
    result: GuessResult | null;
    score: number;
    handleGuess: (guess: Guess) => void;
}

export const GuessUI = (
    {
        currentGuessPrice,
        result,
        score,
        handleGuess,
    }: GuessUIProps) =>
    <>
        {!result && !currentGuessPrice &&
            <GuessButtons onGuess={handleGuess}/>
        }
        {currentGuessPrice && !result &&
            <section className='status-container'>
                Waiting for result... Your guess: {currentGuessPrice}
            </section>
        }
        {result && !currentGuessPrice &&
            <GuessResultMessage result={result}/>
        }
        <Score score={score}/>
    </>