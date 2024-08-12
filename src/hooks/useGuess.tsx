import { useState, useCallback, useEffect, useRef } from 'react';

export interface GuessState {
    score: number;
    currentGuess: 'up' | 'down' | null;
    currentGuessPrice: number | null;
    isWaitingForPriceChange: boolean;
}

export interface Result {
    guessPrice: number;
    resolvedPrice: number;
    guess: 'up' | 'down';
}

export interface UseGuessReturn extends Omit<GuessState, 'isWaitingForPriceChange'> {
    handleGuess: (newGuess: 'up' | 'down') => void;
    didWin: (result: Result) => boolean;
}

export interface UseGuessProps {
    btcPrice: number | null;
    onResult?: (result: Result) => void;
    initialScore?: number;
}

export const useGuess = ({initialScore, btcPrice, onResult}: UseGuessProps): UseGuessReturn => {
    const [ state, setState ] = useState<GuessState>({
        score: initialScore ?? 0,
        currentGuess: null,
        currentGuessPrice: null,
        isWaitingForPriceChange: false,
    });

    const timeoutRef = useRef<number | null>(null);

    const handleGuess = (newGuess: 'up' | 'down') => {
        setState(prevState => ({
            ...prevState,
            currentGuess: newGuess,
            currentGuessPrice: btcPrice,
            isWaitingForPriceChange: false,
        }));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setState(prevState => ({
                ...prevState,
                isWaitingForPriceChange: true,
            }));
            // TODO: Change timer to 60000
        }, 1000);
    };

    const resolveGuess = useCallback(() => {
        if (state.currentGuess && state.currentGuessPrice !== null && btcPrice && state.currentGuessPrice !== btcPrice) {
            const guessPrice = state.currentGuessPrice;
            const guess = state.currentGuess;
            let isCorrect = false;
            if (state.currentGuess === 'up' && btcPrice > state.currentGuessPrice) {
                isCorrect = true;
            } else if (state.currentGuess === 'down' && btcPrice < state.currentGuessPrice) {
                isCorrect = true;
            }

            const newResult = {
                guessPrice,
                resolvedPrice: btcPrice,
                guess,
            }

            setState(prevState => ({
                ...prevState,
                score: isCorrect ? prevState.score + 1 : prevState.score ? prevState.score - 1 : 0,
                currentGuess: null,
                currentGuessPrice: null,
                isWaitingForPriceChange: false,
            }));
            onResult?.(newResult);
        }
    }, [ btcPrice, state.currentGuess, state.currentGuessPrice, onResult ]);

    useEffect(() => {
        if (state.isWaitingForPriceChange) {
            resolveGuess();
        }
    }, [ state.isWaitingForPriceChange, resolveGuess ]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const didWin = (result: Result) =>
        (result.guess === 'up' && result.resolvedPrice > result.guessPrice) ||
        (result.guess === 'down' && result.resolvedPrice < result.guessPrice);

    const {score, currentGuess, currentGuessPrice} = state;

    return {score, currentGuess, currentGuessPrice, handleGuess, didWin};
};