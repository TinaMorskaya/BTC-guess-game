import { Score } from './Score.tsx';
import { useGuess } from '../hooks/useGuess.tsx';
import { useEffect, useRef, useState } from 'react';
import { GuessButtons } from './GuessButtons.tsx';
import { GuessStatus } from './GuessStatus.tsx';
import { useGameContext } from '../hooks/useGameContext.tsx';
import { saveScore } from '../api/saveScore.ts';

export const GuessContainer = () => {
    const [ showResult, setShowResult ] = useState(false);
    const resultTimeoutRef = useRef<number | null>(null);
    const {btcPrice} = useGameContext();
    const {
        score,
        guessPrice,
        guess,
        lastResult,
        handleGuess,
        didWin,
    } = useGuess({btcPrice});

    useEffect(() => {
        if (resultTimeoutRef.current) {
            window.clearTimeout(resultTimeoutRef.current);
        }

        if (lastResult) {
            setShowResult(true);
            resultTimeoutRef.current = window.setTimeout(() => {
                setShowResult(false);
            }, 5000);
            setShowResult(true);
            saveScore({score: lastResult.guessPrice});
        }
    }, [ lastResult ]);

    const win = lastResult && didWin(lastResult);

    return (
        <>
            <GuessButtons disabled={Boolean(guess || showResult)} onGuess={handleGuess}/>
            <GuessStatus guessPrice={guessPrice} showResult={showResult} lastResult={lastResult} win={win}/>
            <Score score={score}/>
        </>
    );
}
