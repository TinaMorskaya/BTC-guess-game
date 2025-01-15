import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Player } from '../types/types.ts';
import { isPlayer } from '../utils/type-guards/isPlayer.ts';

export interface PlayerContextType {
    playerId: string | null;
    score: number;
    increaseScore: () => void;
    decreaseScore: () => void;
}

const getPlayerData = () => {
    const storedData = localStorage.getItem('playerData');

    if (storedData) {
        const parsedData: unknown = JSON.parse(storedData);
        if (isPlayer(parsedData)) {
            return parsedData;
        }
    }

    return {
        playerId: crypto.randomUUID(),
        score: 0,
    };
};

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [ playerData, setPlayerData ] = useState<Player>(getPlayerData);

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