import { Result } from '../hooks/useGuess.tsx';

export interface GuessStatusProps {
    guessPrice: number | null;
    result: Result | null;
    win: boolean | null;
}


export const GuessStatus = ({
                                guessPrice,
                                result,
                                win
                            }: GuessStatusProps) =>
    <div className='status-container'>
        {guessPrice &&
            (
                <p>
                    Waiting for result... Last price: {guessPrice}
                </p>
            )
        }
        {result && (
            <p style={{color: win ? 'green' : 'red'}}>
                You {win ? 'won' : 'lost'}!
                You guessed that {result?.guess === 'up' ? 'the price would go up' : 'the price would go down'}.
                The original price was {result?.guessPrice} and the final price was {result?.resolvedPrice}.
            </p>
        )}
    </div>
