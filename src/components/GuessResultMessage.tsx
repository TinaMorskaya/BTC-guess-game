import { Guess, GuessResult } from '../types.ts';

export interface GuessResultMessageProps {
    result: GuessResult | null;
    win: boolean | null;
}

export const GuessResultMessage = ({result, win}: GuessResultMessageProps) =>
    <section className='status-container'>
        <div role='alert' style={{color: win ? 'green' : 'red'}}>
            You {win ? 'won' : 'lost'}!
            You guessed that {result?.guess === Guess.Up ? 'the price would go up' : 'the price would go down'}.
            The original price was {result?.guessPrice} and the final price was {result?.resolvedPrice}.
        </div>
    </section>