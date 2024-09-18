import React, { createContext, useState } from 'react';
import { Player } from '../types.ts';

export interface GameContextType {
    playerId: string | null;
    score: number;
    increaseScore: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [ playerData, setPlayerData ] = useState<Player>(() => {
        const storedData = localStorage.getItem('playerData');
        return storedData ? JSON.parse(storedData) : {
            playerId: crypto.randomUUID(),
            score: 0,
        };
    });

    const increaseScore = () => {
        const updatedData = {...playerData, score: ++playerData.score};
        setPlayerData(updatedData);
        localStorage.setItem('playerData', JSON.stringify(updatedData));
    }


    return (
        <GameContext.Provider value={{
            playerId: playerData.playerId,
            score: playerData.score,
            increaseScore,
        }}>
            {children}
        </GameContext.Provider>
    );
};