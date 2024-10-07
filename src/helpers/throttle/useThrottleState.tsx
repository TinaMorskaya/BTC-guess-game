import { useState, useRef, useEffect } from 'react';
import { throttle, ThrottleFunction, ThrottleOptions } from './throttle.ts';

export type UseThrottleStateReturn<T> = readonly [ T, ThrottleFunction<T[]> ];


export function useThrottleState<T>(initialState: T, wait: number = 300, options?: ThrottleOptions): UseThrottleStateReturn<T> {
    const [ state, setState ] = useState<T>(initialState);
    const throttleFunction = useRef(throttle({callback: setState, wait, options})).current;

    useEffect(() => {
        return () => throttleFunction.cancel();
    }, [ throttleFunction ]);

    return [ state, throttleFunction ] as const;
}