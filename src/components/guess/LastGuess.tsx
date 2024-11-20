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
        <div className='last-guess__label'>
            <h3 className='box__header'>
                Your guess
            </h3>
            <p className='last-guess__value'>
                {currentGuess ?? result?.guess}
            </p>
        </div>
        <div className='last-guess__label'>
            <h3 className='box__header'>
                Original price
            </h3>
            <p className='last-guess__value'>
                {currentGuessPrice ?? result?.guessPrice}
            </p>
        </div>
        <div className='last-guess__label'>
            <h3 className='box__header'>
                Actual price
            </h3>
            <p className='last-guess__value'>
                {!currentGuess && !currentGuessPrice && result?.resolvedPrice}
            </p>
        </div>
    </section>
)