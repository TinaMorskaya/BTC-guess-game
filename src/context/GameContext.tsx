import React, { createContext, useState, useEffect } from 'react';
import { useBTCCostUSD } from '../hooks/useBTCCostUSD.tsx';

export interface GameContextType {
    btcPrice: number | null;
    btcPriceDate: Date | null;
    playerId: string | null;
    setPlayerId: (id: string | null) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {price: btcPrice, date: btcPriceDate} = useBTCCostUSD();
    const [ playerId, setPlayerId ] = useState<string | null>(() => {
        const playerIdItem = localStorage.getItem('playerId');
        return playerIdItem ? JSON.parse(playerIdItem) : null;
    });

    useEffect(() => {
        if (playerId) {
            localStorage.setItem('playerId', JSON.stringify(playerId));
        }
    }, [ playerId ]);

    return (
        <GameContext.Provider value={{btcPrice, btcPriceDate, playerId, setPlayerId}}>
            {children}
        </GameContext.Provider>
    );
};