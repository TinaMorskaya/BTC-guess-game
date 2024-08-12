export interface GuessStatusProps {
    guessPrice: number | null;
    showResult: boolean;
    lastResult: {
        guess: 'up' | 'down';
        guessPrice: number;
        currentPrice: number;
    } | null;
    win: boolean | null;
}


export const GuessStatus = ({
                                guessPrice,
                                showResult,
                                lastResult,
                                win,
                            }: GuessStatusProps) =>
    <div className='status-container'>
        {guessPrice &&
            (
                <p>
                    Waiting for result... Last price: {guessPrice}
                </p>
            )
        }
        {showResult && lastResult && (
            <p style={{color: win ? 'green' : 'red'}}>
                You {win ? 'won' : 'lost'}!
                You guessed that {lastResult?.guess === 'up' ? 'the price would go up' : 'the price would go down'}.
                The original price was {lastResult?.guessPrice} and the final price was {lastResult?.currentPrice}.
            </p>
        )}
    </div>
