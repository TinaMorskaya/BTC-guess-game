import { describe, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useThrottleState } from '../useThrottleState.tsx';

describe('throttle', () => {
    const initialState = {
        str: 'initial',
        init: true
    };

    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('should return a throttled function and state', () => {
        const {result} = renderHook(() =>
            useThrottleState(initialState, 100, {leading: false})
        );
        const [ state, updateState ] = result.current;
        expect(state).toEqual(initialState);

        const updatedState = {
            str: 'first call',
            init: false
        };

        updateState(updatedState);
        const [ state1 ] = result.current;
        expect(state1).toEqual(initialState);

        vi.advanceTimersByTime(50);

        updateState(updatedState);
        const [ state2 ] = result.current;
        expect(state2).toEqual(initialState);

        act(() => {
            vi.advanceTimersByTime(50);
        });

        const [ state3 ] = result.current;
        expect(state3).toEqual(updatedState);
    });

    it('should call cancel method of throttle function on unmount', () => {
        const {result, unmount} = renderHook(() =>
            useThrottleState(initialState, 100, {leading: false})
        );

        const throttleFunction = result.current[1];
        const cancelSpy = vi.spyOn(throttleFunction, 'cancel');

        unmount();

        expect(cancelSpy).toBeCalled();
    });
});