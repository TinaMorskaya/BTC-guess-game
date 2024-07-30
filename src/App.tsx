import './App.css'
import { useBTCCostUSD } from './hooks/useBTCCostUSD.tsx';
import { GuessContainer } from './components/GuessContainer.tsx';

function App() {
    const {price, date} = useBTCCostUSD();

    if (!price || !date) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>Current price: {price}</p>
            <GuessContainer btcPrice={price} btcPriceDate={date}/>
        </>
    )
}

export default App
