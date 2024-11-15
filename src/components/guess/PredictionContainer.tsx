import { useGuess } from '../../hooks/useGuess.tsx';
import { useRef, useState } from 'react';
import { GuessResult } from '../../types.ts';
import { GuessButtonsContainer } from './GuessButtonsContainer.tsx';
import { usePlayerContext } from '../../hooks/usePlayerContext.tsx';
import { useBTCPriceContext } from '../../hooks/useBTCPriceContext.tsx';
import { LastGuess } from './LastGuess.tsx';

export const PredictionContainer = () => {
    //MOVE to context
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
        }, 5000);
    };

    const {
        currentGuessPrice,
        handleGuess,
        currentGuess,
    } = useGuess({btcPrice: btcPrice ?? 0, onResult});

    return (
        <>
            <GuessButtonsContainer
                currentGuessPrice={currentGuessPrice}
                isWinner={result?.isWinner ?? false}
                handleGuess={handleGuess}
                showResult={showResult}
            />
            <LastGuess currentGuess={currentGuess} currentGuessPrice={currentGuessPrice} result={result}/>
        </>
    );
}
