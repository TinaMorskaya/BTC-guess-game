import { useGuess } from '../hooks/useGuess.tsx';
import { useRef, useState } from 'react';
import { useGameContext } from '../hooks/useGameContext.tsx';
import { GuessResult } from '../types.ts';
import { GuessUI } from './GuessUI.tsx';

export const GuessContainer = () => {
    const [ result, setResult ] = useState<GuessResult | null>(null);
    const [ win, setWin ] = useState<boolean | null>(null);
    const resultTimeoutRef = useRef<number | null>(null);
    const {btcPrice} = useGameContext();

    const onResult = (result: GuessResult) => {
        if (resultTimeoutRef.current) {
            window.clearTimeout(resultTimeoutRef.current);
        }

        setWin(didWin(result));
        setResult(result);
        resultTimeoutRef.current = window.setTimeout(() => {
            setWin(null);
            setResult(null);
        }, 5000);
    };

    const {
        score,
        currentGuessPrice,
        handleGuess,
        didWin,
    } = useGuess({btcPrice, onResult});


    return (
        <GuessUI
            currentGuessPrice={currentGuessPrice}
            result={result}
            win={win}
            score={score}
            handleGuess={handleGuess}
        />
    );
}
