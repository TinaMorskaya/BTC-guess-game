import './App.css'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import { GameContainer } from './components/game/GameContainer.tsx';
import { BTCPriceProvider } from './contexts/BTCPriceContext.tsx';

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
