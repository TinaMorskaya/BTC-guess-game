import { Guess, GuessResult } from '../../types.ts';

export interface LastGuessProps {
    currentGuess: Guess | null;
    currentGuessPrice: number | null;
    result: GuessResult | null;
}


export const LastGuess = (
    {
        currentGuess,
        currentGuessPrice,
        result,
    }: LastGuessProps) => (
    <section className='box flex-column last-guess'>
        <div className='last-guess-content'>
            <h3 className='last-guess-label'>
                Your guess
                <span className='last-guess-value'>
                        {currentGuess ?? result?.guess}
                    </span>
            </h3>
            <h3 className='last-guess-label'>
                Original price
                <span className='last-guess-value'>
                        {currentGuessPrice ?? result?.guessPrice}
                    </span>
            </h3>
            <h3 className='last-guess-label'>
                Actual price
                <span className='last-guess-value'>
                        {result?.resolvedPrice}
                    </span>
            </h3>
        </div>
    </section>
)