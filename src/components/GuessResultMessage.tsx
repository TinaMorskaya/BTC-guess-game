import { Guess, GuessResult } from '../types.ts';

export interface GuessResultMessageProps {
    result: GuessResult;
}

export const GuessResultMessage = ({result}: GuessResultMessageProps) => {
    const {isWinner, guess, guessPrice, resolvedPrice} = result;
    return (
        <section className='status-container'>
            <div role='alert' style={{color: isWinner ? 'green' : 'red'}}>
                You {isWinner ? 'won' : 'lost'}!
                You guessed that {guess === Guess.Up ? 'the price would go up' : 'the price would go down'}.
                The original price was {guessPrice} and the final price was {resolvedPrice}.
            </div>
        </section>
    )
}