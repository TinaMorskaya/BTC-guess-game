import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useGuess, UseGuessProps } from '../useGuess.tsx';
import { act, renderHook } from '@testing-library/react';
import { Guess } from '../../types/types.ts';

describe('useGuess', () => {
    const onResult = vi.fn();

    const renderCustomHook = (initialProps?: Partial<UseGuessProps>) => {
        return renderHook(
            (props?: Partial<UseGuessProps>) => useGuess({btcPrice: 100, onResult, ...props}),
            {initialProps}
        );
    };

    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('should return default values', () => {
        const {result} = renderCustomHook();
        const {currentGuess, currentGuessPrice, handleGuess} = result.current;

        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(handleGuess).toBeDefined();
        expect(onResult).not.toHaveBeenCalled();
    });

    it('should initialize state correctly with provided props', () => {
        const {result} = renderCustomHook({btcPrice: 100});
        const {currentGuess, currentGuessPrice} = result.current;

        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(onResult).not.toHaveBeenCalled();
    });

    it('should set a timer for 1 second after calling handleGuess, ' +
        'wait until time passes and btcPrice changes' +
        'AND call onResult with isWinner equal true score if guess was Up and btcPrice went Up', () => {
        const {result, rerender} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Up);
        });


        expect(result.current.currentGuess).toBe(Guess.Up);
        expect(result.current.currentGuessPrice).toBe(100);
        expect(onResult).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(onResult).not.toHaveBeenCalled();


        rerender({btcPrice: 200});


        const {currentGuess, currentGuessPrice} = result.current;
        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(onResult).toHaveBeenCalledWith({guessPrice: 100, resolvedPrice: 200, guess: Guess.Up, isWinner: true});
    });

    it('should NOT call onResult if btcPrice did change, but time did not pass', () => {
        const {result, rerender} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Up);
        });

        expect(result.current.currentGuess).toBe(Guess.Up);
        expect(result.current.currentGuessPrice).toBe(100);
        expect(onResult).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(4999);
        });

        rerender({btcPrice: 200});

        expect(onResult).not.toHaveBeenCalled();
        expect(result.current.currentGuess).toBe(Guess.Up);
        expect(result.current.currentGuessPrice).toBe(100);
    });

    it('should return result with isWinner false, if guess was Down and btcPrice went Up', () => {
        const {result, rerender} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Down);
        });

        expect(result.current.currentGuess).toBe(Guess.Down);
        expect(result.current.currentGuessPrice).toBe(100);
        expect(onResult).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(onResult).not.toHaveBeenCalled();

        rerender({btcPrice: 101});

        const {currentGuess, currentGuessPrice} = result.current;
        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(onResult).toHaveBeenCalledWith({
            guessPrice: 100,
            resolvedPrice: 101,
            guess: Guess.Down,
            isWinner: false
        });
    });

    it('should return result with isWinner false, if guess was Up and btcPrice went Down', () => {
        const {result, rerender} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Up);
        });

        expect(result.current.currentGuess).toBe(Guess.Up);
        expect(result.current.currentGuessPrice).toBe(100);
        expect(onResult).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(onResult).not.toHaveBeenCalled();

        rerender({btcPrice: 99});

        const {currentGuess, currentGuessPrice} = result.current;
        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(onResult).toHaveBeenCalledWith({guessPrice: 100, resolvedPrice: 99, guess: Guess.Up, isWinner: false});
    });

    it('should increase score if guess was Down and btcPrice went Down', () => {
        const {result, rerender} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Down);
        });

        expect(result.current.currentGuess).toBe(Guess.Down);
        expect(result.current.currentGuessPrice).toBe(100);
        expect(onResult).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(onResult).not.toHaveBeenCalled();

        rerender({btcPrice: 99});

        const {currentGuess, currentGuessPrice} = result.current;
        expect(currentGuess).toBeNull();
        expect(currentGuessPrice).toBeNull();
        expect(onResult).toHaveBeenCalledWith({guessPrice: 100, resolvedPrice: 99, guess: Guess.Down, isWinner: true});
    });

    it('should clear previous timeout when new guess is set', () => {
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
        const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
        const {result} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Up);
        });

        console.log(setTimeoutSpy.mock.results[0].value);
        const timeoutReturn = setTimeoutSpy.mock.results[0];

        act(() => {
            handleGuess(Guess.Down);
        });

        expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutReturn.value);

        clearTimeoutSpy.mockRestore();
        setTimeoutSpy.mockRestore();
    });

    it('should clear timeout when unmounted', () => {
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
        const {unmount, result} = renderCustomHook();
        const {handleGuess} = result.current;

        act(() => {
            handleGuess(Guess.Up);
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
        clearTimeoutSpy.mockRestore();
    });
});