import { GameLoading } from './GameLoading.tsx';
import { GameContent } from './GameContent.tsx';
import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';

export const GameContainer = () => {
    const {btcPrice, btcWebSocketStatus} = useBTCPriceContext();

    return (
        <>
            {!btcPrice
                ? <GameLoading status={btcWebSocketStatus}/>
                : <GameContent/>
            }
        </>
    )
}