// How to use:
// import { throttle } from './helpers/throttle';
//
// const debouncedFunction = throttle({callback: () => console.log('Hello, world!'), wait: 300});
// debouncedFunction();
// debouncedFunction.flush();
// debouncedFunction.cancel();


export type ThrottleCallback<T> = (...args: T[]) => void;

type ThrottleOptions =
    | { leading: false, trailing?: true }
    | { trailing: false, leading?: true }

export interface ThrottleArgs<T> {
    callback: ThrottleCallback<T>;
    wait: number;
    options?: ThrottleOptions;
}

export interface ThrottleFunction<T extends unknown[]> {
    cancel: () => void
    flush: () => void

    (...args: Parameters<ThrottleCallback<T>>): void
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
    let callbackArgs: T[] | null = null;

    const reset = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        callCount = 0;
        timeoutId = null;
        callbackArgs = null;
    }


    const throttleFunction = (...args: Parameters<ThrottleCallback<T>>): void => {
        callbackArgs = args;
        callCount++;

        if (leading && callCount === 1) {
            callback(...callbackArgs);
        }


        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                if (trailing && callCount > 1 && callbackArgs) {
                    callback(...callbackArgs);
                }
                reset();
            }, wait);
        }
    };

    throttleFunction.cancel = reset;

    throttleFunction.flush = () => {
        if (callbackArgs) {
            callback(...callbackArgs);
            reset();
        }
    }

    return throttleFunction;
};