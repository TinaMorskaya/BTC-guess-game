// How to use:
// import { throttle } from './helpers/throttle';
//
// const debouncedFunction = throttle({callback: () => console.log('Hello, world!'), wait: 300});
// debouncedFunction();
// debouncedFunction.flush();
// debouncedFunction.cancel();

export type ThrottleCallback<T extends unknown[]> = (...args: T) => void;

export type ThrottleOptions =
    | { leading: false, trailing?: true }
    | { trailing: false, leading?: true }
    | { leading: true, trailing: true };

export interface ThrottleFunction<T extends unknown[]> extends ThrottleCallback<T> {
    cancel: () => void;
    flush: () => void;
}

export interface ThrottleArgs<T extends unknown[]> {
    callback: ThrottleCallback<T>;
    wait: number;
    options?: ThrottleOptions;
}

export const throttle = <T extends unknown[]>(
    {
        callback,
        wait,
        options
    }: ThrottleArgs<T>): ThrottleFunction<T> => {
    const leading = options?.leading ?? true;
    const trailing = options?.trailing ?? true;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let callCount = 0;
    let lastArgs: T | null = null;

    const reset = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        callCount = 0;
        timeoutId = null;
        lastArgs = null;
    }

    const throttleFunction = (...args: T): void => {
        lastArgs = args;
        callCount++;

        if (leading && callCount === 1) {
            callback(...lastArgs);
        }

        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                if (trailing && callCount > 1 && lastArgs) {
                    callback(...lastArgs);
                }
                reset();
            }, wait);
        }
    };

    throttleFunction.cancel = reset;

    throttleFunction.flush = () => {
        if (lastArgs) {
            callback(...lastArgs);
            reset();
        }
    }

    return throttleFunction;
};