import { GuessContainer } from './GuessContainer.tsx';
import { useBTCCostUSD } from '../hooks/useBTCCostUSD.tsx';

export const GameContainer = () => {
    const {price, status} = useBTCCostUSD();

    if (!price) {
        return (
            <main>
                <p>Loading bitcoin price...</p>
                {status && <p>Status: {status}</p>}
            </main>
        )
    }

    return (
        <>
            <p>Current price: {price}</p>
            <GuessContainer btcPrice={price}/>
        </>
    )
}