import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Player } from '../types.ts';

export interface PlayerContextType {
    playerId: string | null;
    score: number;
    increaseScore: () => void;
    decreaseScore: () => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [ playerData, setPlayerData ] = useState<Player>(() => {
        const storedData = localStorage.getItem('playerData');
        return storedData ? JSON.parse(storedData) : {
            playerId: crypto.randomUUID(),
            score: 0,
        };
    });

    const changeScore = useCallback((updatedScore: Player['score']) => {
        const updatedData = {...playerData, score: updatedScore};
        setPlayerData(updatedData);
        localStorage.setItem('playerData', JSON.stringify(updatedData));
    }, [ playerData ]);

    const increaseScore = useCallback(() =>
            changeScore(playerData.score + 1),
        [ playerData.score, changeScore ]
    );

    const decreaseScore = useCallback(() =>
            changeScore(Math.max(0, playerData.score - 1)),
        [ playerData.score, changeScore ]
    );

    const playerContextValue = useMemo(() => ({
        playerId: playerData.playerId,
        score: playerData.score,
        increaseScore,
        decreaseScore,
    }), [
        playerData.playerId,
        playerData.score,
        increaseScore,
        decreaseScore,
    ]);

    return (
        <PlayerContext.Provider value={playerContextValue}>
            {children}
        </PlayerContext.Provider>
    );
};