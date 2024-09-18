import { useGuess } from '../hooks/useGuess.tsx';
import { useRef, useState } from 'react';
import { GuessResult } from '../types.ts';
import { GuessUI } from './GuessUI.tsx';
import { useGameContext } from '../hooks/useGameContext.tsx';

export interface GuessContainerProps {
    btcPrice: number;
}

export const GuessContainer = ({btcPrice}: GuessContainerProps) => {
    const [ result, setResult ] = useState<GuessResult | null>(null);
    const resultTimeoutRef = useRef<number | null>(null);
    const {score, increaseScore} = useGameContext();

    const onResult = (result: GuessResult) => {
        if (resultTimeoutRef.current) {
            window.clearTimeout(resultTimeoutRef.current);
        }

        setResult(result);
        if (result.isWinner) increaseScore();
        resultTimeoutRef.current = window.setTimeout(() => {
            setResult(null);
        }, 5000);
    };

    const {
        currentGuessPrice,
        handleGuess,
    } = useGuess({btcPrice, onResult});


    return (
        <GuessUI
            currentGuessPrice={currentGuessPrice}
            result={result}
            score={score}
            handleGuess={handleGuess}
        />
    );
}
