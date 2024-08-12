import { GuessContainer } from './GuessContainer.tsx';
import { useGameContext } from '../hooks/useGameContext.tsx';

export const GameContainer = () => {
    const {btcPrice} = useGameContext();

    if (!btcPrice) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Current price: {btcPrice}</p>
            <GuessContainer/>
        </>
    )
}