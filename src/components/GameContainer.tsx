import { GuessContainer } from './GuessContainer.tsx';
import { useBTCCostUSD } from '../hooks/useBTCCostUSD.tsx';

export const GameContainer = () => {
    const {price} = useBTCCostUSD();

    if (!price) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Current price: {price}</p>
            <GuessContainer btcPrice={price}/>
        </>
    )
}