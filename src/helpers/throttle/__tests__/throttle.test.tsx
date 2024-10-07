import { describe, expect, vi } from 'vitest';
import { throttle } from '../throttle.ts';

describe('throttle', () => {
    const callback = vi.fn();
    const wait = 10;

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

    it('should return a throttled function that calls the callback before the wait time, ' +
        'but not after when the functions was NOT called during the wait time if options are default', () => {
        const throttleFunction = throttle({callback, wait});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledWith('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(1);

        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledTimes(1);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('b', 3, true, {foo: 'baz'});
        expect(callback).toBeCalledWith('b', 3, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(2);

        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledTimes(2);
    });

    it('should calls the callback before and after the wait time ' +
        'when the functions was called during the wait time if options are default', () => {
        const throttleFunction = throttle({callback, wait});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledWith('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(1);

        throttleFunction('b', 3, true, {foo: 'baz'});
        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledWith('b', 3, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(2);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledWith('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(3);

        throttleFunction('d', 5, false, {foo: 'b'});
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(3);
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledWith('d', 5, false, {foo: 'b'});
        expect(callback).toBeCalledTimes(4);
    });

    it('should calls the callback only before the wait time if trailing is false', () => {
        const throttleFunction = throttle({callback, wait, options: {trailing: false}});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledWith('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(1);

        vi.advanceTimersByTime(wait / 2);

        // call the function again during the wait time
        throttleFunction('c', 4, true, {foo: 'baz'});

        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(1);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('d', 5, true, {foo: 'baz'});
        expect(callback).toBeCalledWith('d', 5, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(2);

        // do NOT call the function again during the wait time
        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledTimes(2);
    });

    it('should call the callback only after the wait time ' +
        'when the functions was called during the wait time if leading is false', () => {
        const throttleFunction = throttle({callback, wait, options: {leading: false}});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(0);

        vi.advanceTimersByTime(wait / 2);

        throttleFunction('b', 3, true, {foo: 'baz'});

        throttleFunction('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(0);
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledWith('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(1);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('d', 5, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(1);

        throttleFunction('e', 6, false, {foo: 'x'});
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(1);
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledWith('e', 6, false, {foo: 'x'});
        expect(callback).toBeCalledTimes(2);
    });

    it('should NOT call the callback after the wait time ' +
        'when the functions was NOT called during the wait time if leading is false', () => {
        const throttleFunction = throttle({callback, wait, options: {leading: false}});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(0);
        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledTimes(0);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('b', 3, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(0);
        vi.advanceTimersByTime(wait);
        expect(callback).toBeCalledTimes(0);
    });

    it('should cancel the timeout and reset throttleFunction variables when cancel method is called', () => {
        const throttleFunction = throttle({callback, wait});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledWith('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(1);

        vi.advanceTimersByTime(wait / 2);
        throttleFunction('b', 3, true, {foo: 'baz'});
        throttleFunction.cancel();
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(1);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledWith('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(2);
        throttleFunction('d', 5, false, {foo: 'b'});
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(2);
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledWith('d', 5, false, {foo: 'b'});
        expect(callback).toBeCalledTimes(3);
    });

    it('should call the callback when the method flush is called', () => {
        const throttleFunction = throttle({callback, wait});

        throttleFunction('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledWith('a', 2, false, {foo: 'bar'});
        expect(callback).toBeCalledTimes(1);

        vi.advanceTimersByTime(wait / 2);
        throttleFunction('b', 3, true, {foo: 'baz'});
        throttleFunction.flush();
        expect(callback).toBeCalledWith('b', 3, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(2);

        //reset all throttleFunction variables after the wait time - one cycle
        throttleFunction('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledWith('c', 4, true, {foo: 'baz'});
        expect(callback).toBeCalledTimes(3);

        throttleFunction('d', 5, false, {foo: 'b'});
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledTimes(3);
        vi.advanceTimersByTime(wait / 2);
        expect(callback).toBeCalledWith('d', 5, false, {foo: 'b'});
        expect(callback).toBeCalledTimes(4);
    });
});