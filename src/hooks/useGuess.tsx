import { useCallback, useEffect, useRef, useState } from 'react';
import { Guess, GuessResult } from '../types.ts';

export interface GuessState {
    currentGuess: Guess | null;
    currentGuessPrice: number | null;
    isWaitingForPriceChange: boolean;
}

export interface UseGuessReturn extends Omit<GuessState, 'isWaitingForPriceChange'> {
    handleGuess: (newGuess: Guess) => void;
}

export interface UseGuessProps {
    btcPrice: number;
    onResult: (result: GuessResult) => void;
}

export const useGuess = ({btcPrice, onResult}: UseGuessProps): UseGuessReturn => {
    const [ state, setState ] = useState<GuessState>({
        currentGuess: null,
        currentGuessPrice: null,
        isWaitingForPriceChange: false,
    });

    const timeoutRef = useRef<number | null>(null);

    const handleGuess = (newGuess: Guess) => {
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
        if (state.currentGuess && state.currentGuessPrice !== null && state.currentGuessPrice !== btcPrice) {
            const guessPrice = state.currentGuessPrice;
            const guess = state.currentGuess;

            const newResult = {
                guessPrice,
                resolvedPrice: btcPrice,
                guess,
                isWinner: didWin({guessPrice, resolvedPrice: btcPrice, guess}),
            }

            setState(prevState => ({
                ...prevState,
                currentGuess: null,
                currentGuessPrice: null,
                isWaitingForPriceChange: false,
            }));
            onResult(newResult);
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

    const didWin = ({guess, guessPrice, resolvedPrice}: Omit<GuessResult, 'isWinner'>) =>
        (guess === Guess.Up && resolvedPrice > guessPrice) ||
        (guess === Guess.Down && resolvedPrice < guessPrice);

    const {currentGuess, currentGuessPrice} = state;
    return {currentGuess, currentGuessPrice, handleGuess};
};