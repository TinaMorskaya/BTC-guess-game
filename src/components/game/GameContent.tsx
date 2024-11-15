import { PredictionContainer } from '../guess/PredictionContainer.tsx';
import { CurrentPrice } from './CurrentPrice.tsx';
import { Score } from '../guess/Score.tsx';

export const GameContent = () => (
    <>
        <section aria-label='Game description' className='game-description box'>
            <h1>BitPredict: 60-Second Bitcoin Price Challenge</h1>
            <p>Predict Bitcoin's price movement in this quick-fire guessing game.
                Choose 'Up' or 'Down' for the BTC/USD price in the next minute.
                Correct guesses earn you a point, wrong ones cost you.
                Watch the live price, time your predictions, and see how high you can score!
            </p>
        </section>
        <section aria-label='Game' className='game'>
            <CurrentPrice/>
            <Score/>
            <PredictionContainer/>
        </section>
    </>
);