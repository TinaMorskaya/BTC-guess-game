import { Score } from './Score.tsx';
import { Result, useGuess } from '../hooks/useGuess.tsx';
import { useRef, useState } from 'react';
import { GuessButtons } from './GuessButtons.tsx';
import { GuessStatus } from './GuessStatus.tsx';
import { useGameContext } from '../hooks/useGameContext.tsx';

export const GuessContainer = () => {
    const [ result, setResult ] = useState<Result | null>(null);
    const [ win, setWin ] = useState<boolean | null>(null);
    const resultTimeoutRef = useRef<number | null>(null);
    const {btcPrice} = useGameContext();

    const onResult = (result: Result) => {
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
        currentGuess,
        handleGuess,
        didWin,
    } = useGuess({btcPrice, onResult});


    return (
        <>
            <GuessButtons disabled={Boolean(currentGuess || result)} onGuess={handleGuess}/>
            <GuessStatus guessPrice={currentGuessPrice} result={result} win={win}/>
            <Score score={score}/>
        </>
    );
}
