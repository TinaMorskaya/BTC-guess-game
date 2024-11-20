import { GuessPredictionContainer } from '../guess/GuessPredictionContainer.tsx';
import { CurrentPrice } from './CurrentPrice.tsx';
import { Score } from './Score.tsx';

export const Game = () => (
    <div className='game'>
        <section aria-label='Game description' className='description box'>
            <h1>BitPredict: 60-Second Bitcoin Price Challenge</h1>
            <p>Predict Bitcoin's price movement in this quick-fire guessing game.
                Choose 'Up' or 'Down' for the BTC/USD price in the next minute.
                Correct guesses earn you a point, wrong ones cost you.
                Watch the live price, time your predictions, and see how high you can score!
            </p>
        </section>
        <section aria-label='Game' className='game__content'>
            <CurrentPrice/>
            <Score/>
            <GuessPredictionContainer/>
        </section>
    </div>
);