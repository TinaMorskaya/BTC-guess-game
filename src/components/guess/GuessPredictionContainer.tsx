import { useGuess } from '../../hooks/useGuess.tsx';
import { useRef, useState } from 'react';
import { GuessResult } from '../../types.ts';
import { GuessPanel } from './GuessPanel.tsx';
import { usePlayerContext } from '../../hooks/usePlayerContext.tsx';
import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';
import { LastGuess } from './LastGuess.tsx';

export const TIMEOUT_SHOW_RESULT = 5000;

export const GuessPredictionContainer = () => {
    const [ result, setResult ] = useState<GuessResult | null>(null);
    const [ showResult, setShowResult ] = useState(false);
    const resultTimeoutRef = useRef<number | null>(null);
    const {increaseScore, decreaseScore} = usePlayerContext();
    const {btcPrice} = useBTCPriceContext();

    const onResult = (result: GuessResult) => {
        if (resultTimeoutRef.current) {
            window.clearTimeout(resultTimeoutRef.current);
        }

        setResult(result);
        setShowResult(true);

        if (result.isWinner) {
            increaseScore()
        } else {
            decreaseScore()
        }

        resultTimeoutRef.current = window.setTimeout(() => {
            setShowResult(false);
        }, TIMEOUT_SHOW_RESULT);
    };

    const {
        currentGuessPrice,
        handleGuess,
        currentGuess,
    } = useGuess({btcPrice: btcPrice ?? 0, onResult});

    return (
        <>
            <GuessPanel
                currentGuessPrice={currentGuessPrice}
                isWinner={Boolean(result?.isWinner)}
                handleGuess={handleGuess}
                showResult={showResult}
            />
            <LastGuess currentGuess={currentGuess} currentGuessPrice={currentGuessPrice} result={result}/>
        </>
    );
}
