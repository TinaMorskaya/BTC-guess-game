import { useCallback, useEffect, useRef, useState } from 'react';
import { Score } from './Score.tsx';

export interface GuessContainerProps {
    btcPrice: number;
    btcPriceDate: Date;
}

export const GuessContainer = ({btcPrice}: GuessContainerProps) => {
    const [ score, setScore ] = useState(0);
    const [ guess, setGuess ] = useState<'up' | 'down' | null>(null);
    const [ lastPrice, setLastPrice ] = useState<number | null>(null);
    const [ isWaitingForPriceChange, setIsWaitingForPriceChange ] = useState(false);
    const [ result, setResult ] = useState<'win' | 'lose' | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const resultTimeoutRef = useRef<number | null>(null);


    const handleGuess = (newGuess: 'up' | 'down') => {
        setGuess(newGuess);
        setLastPrice(btcPrice);
        setIsWaitingForPriceChange(false);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        console.log('guess:', newGuess);
        console.log('lastPrice:', btcPrice);
        timeoutRef.current = setTimeout(() => {
            setIsWaitingForPriceChange(true);
        }, 10000);
    };

    const resolveGuess = useCallback(() => {
        console.log('I am in resolveGuess');
        if (guess && lastPrice !== null && lastPrice !== btcPrice) {
            console.log('resolving guess:', btcPrice);
            let isCorrect = false;
            if (guess === 'up' && btcPrice > lastPrice) {
                isCorrect = true;
            } else if (guess === 'down' && btcPrice < lastPrice) {
                isCorrect = true;
            }

            setScore(prevScore => isCorrect ? prevScore + 1 : prevScore ? prevScore - 1 : 0);
            setGuess(null);
            setLastPrice(null);
            setIsWaitingForPriceChange(false);

            if (resultTimeoutRef.current) {
                clearTimeout(resultTimeoutRef.current);
            }

            setResult(isCorrect ? 'win' : 'lose');

            resultTimeoutRef.current = setTimeout(() => {
                setResult(null);
            }, 3000);
        }
    }, [ guess, lastPrice, btcPrice ]);

    useEffect(() => {
        if (isWaitingForPriceChange) {
            resolveGuess();
        }
    }, [ btcPrice, isWaitingForPriceChange, lastPrice, resolveGuess ]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className='buttons-container'>
                <button onClick={() => handleGuess('up')} disabled={Boolean(guess || result)}>
                    Up
                </button>
                <button onClick={() => handleGuess('down')} disabled={Boolean(guess || result)}>
                    Down
                </button>
            </div>
            {result && (
                <p style={{color: result === 'win' ? 'green' : 'red'}}>
                    You {result}!
                </p>
            )}
            <Score score={score}/>
        </>
    );
}
