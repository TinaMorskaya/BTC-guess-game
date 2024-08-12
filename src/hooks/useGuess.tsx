import { useState, useCallback, useEffect, useRef } from 'react';

export interface GuessState {
    score: number;
    guess: 'up' | 'down' | null;
    guessPrice: number | null;
    isWaitingForPriceChange: boolean;
    lastResult: Result | null;
}

export interface Result {
    guessPrice: number;
    currentPrice: number;
    guess: 'up' | 'down';
}

export interface UseGuessReturn extends Omit<GuessState, 'isWaitingForPriceChange'> {
    handleGuess: (newGuess: 'up' | 'down') => void;
    didWin: (result: Result) => boolean;
}

export interface UseGuessProps {
    btcPrice: number | null;
    initialScore?: number;
}

export const useGuess = ({initialScore, btcPrice}: UseGuessProps): UseGuessReturn => {
    const [ state, setState ] = useState<GuessState>({
        score: initialScore ?? 0,
        guess: null,
        guessPrice: null,
        isWaitingForPriceChange: false,
        lastResult: null,
    });

    const timeoutRef = useRef<number | null>(null);

    const handleGuess = (newGuess: 'up' | 'down') => {
        setState(prevState => ({
            ...prevState,
            guess: newGuess,
            guessPrice: btcPrice,
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
        if (state.guess && state.guessPrice !== null && btcPrice && state.guessPrice !== btcPrice) {
            const guessPrice = state.guessPrice;
            const guess = state.guess;
            let isCorrect = false;
            if (state.guess === 'up' && btcPrice > state.guessPrice) {
                isCorrect = true;
            } else if (state.guess === 'down' && btcPrice < state.guessPrice) {
                isCorrect = true;
            }

            setState(prevState => ({
                ...prevState,
                score: isCorrect ? prevState.score + 1 : prevState.score ? prevState.score - 1 : 0,
                guess: null,
                guessPrice: null,
                isWaitingForPriceChange: false,
                lastResult: {
                    guessPrice,
                    currentPrice: btcPrice,
                    guess,
                }
            }));
        }
    }, [ btcPrice, state.guess, state.guessPrice ]);

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
        (result.guess === 'up' && result.currentPrice > result.guessPrice) ||
        (result.guess === 'down' && result.currentPrice < result.guessPrice);

    const {score, guess, guessPrice, lastResult} = state;

    return {score, guess, guessPrice, lastResult, handleGuess, didWin};
};