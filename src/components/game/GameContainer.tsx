import { GameLoading } from './GameLoading.tsx';
import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';
import { Game } from './Game.tsx';

export const GameContainer = () => {
    const {btcPrice, btcWebSocketStatus} = useBTCPriceContext();

    return (
        <>
            {!btcPrice
                ? <GameLoading status={btcWebSocketStatus}/>
                : <>
                    <Game/>
                </>
            }
        </>
    )
}