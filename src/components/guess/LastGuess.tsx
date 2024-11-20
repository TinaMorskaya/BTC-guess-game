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
        <div className='last-guess__content'>
            <h3 className='last-guess__label box__header'>
                Your guess
                <span className='last-guess__value'>
                        {currentGuess ?? result?.guess}
                    </span>
            </h3>
            <h3 className='last-guess__label box__header'>
                Original price
                <span className='last-guess__value'>
                        {currentGuessPrice ?? result?.guessPrice}
                    </span>
            </h3>
            <h3 className='last-guess__label box__header'>
                Actual price
                <span className='last-guess__value'>
                    {!currentGuess && !currentGuessPrice && result?.resolvedPrice}
                </span>
            </h3>
        </div>
    </section>
)