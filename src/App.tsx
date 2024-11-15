import './App.css'
import { PlayerProvider } from './context/GameProvider.tsx';
import { GameContainer } from './components/game/GameContainer.tsx';
import { BTCPriceProvider } from './context/BTCPriceProvider.tsx';

function App() {
    return (
        <BTCPriceProvider>
            <PlayerProvider>
                <GameContainer/>
            </PlayerProvider>
        </BTCPriceProvider>
    );
}

export default App
