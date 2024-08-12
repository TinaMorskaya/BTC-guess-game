import './App.css'
import { GameProvider } from './context/GameContext.tsx';
import { GameContainer } from './components/GameContainer.tsx';

function App() {
    return (
        <GameProvider>
            <GameContainer/>
        </GameProvider>
    );
}

export default App
