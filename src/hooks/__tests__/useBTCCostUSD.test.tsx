import { afterEach, beforeEach, describe, expect, Mock, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useBTCCostUSD } from '../useBTCCostUSD.tsx';
import { BTCData } from '../../types/types.ts';
import { createBTCWebSocketService, CreateBTCWebSocketServiceProps } from '../../api/createBTCWebSocketService.ts';

vi.mock('../../api/createBTCWebSocketService.ts');

describe('useBTCCostUSD', () => {
    const mockCreateBTCWebSocketService = createBTCWebSocketService as Mock;
    let mockDataListener: (data: BTCData) => void;
    let mockStatusListener: (status: string) => void;
    const mockConnect = vi.fn();
    const mockDisconnect = vi.fn();
    const renderCustomHook = () => renderHook(() => useBTCCostUSD());
    const data: BTCData = {
        p: '5',
        T: Date.parse('2023-01-01T00:00:00Z'),
        e: 'e',
        E: 1,
        s: 's',
        q: 'q',
        t: 1,
        m: true,
        M: true,
    };

    beforeAll(() => {
        vi.useFakeTimers();
    });

    beforeEach(() => {
        mockCreateBTCWebSocketService.mockImplementation((
            {
                dataListener,
                statusListener
            }: CreateBTCWebSocketServiceProps) => {
            mockDataListener = dataListener;
            mockStatusListener = statusListener;
            return {
                connect: mockConnect,
                disconnect: mockDisconnect
            };
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('should return default price, date and status', () => {
        const {result} = renderCustomHook();
        const {price, date, status} = result.current;

        expect(price).toBeNull();
        expect(date).toBeNull();
        expect(status).toBe('');
    })

    it('should update price and date when dataListener is called, ' +
        'update status when statusListener are called during the wait time of 3 sec', () => {
        const {result} = renderCustomHook();

        act(() => {
            mockDataListener(data);
            mockStatusListener('connected');
        });

        const {price, date, status} = result.current;
        expect(price).toBe(5);
        expect(date).toEqual(new Date('2023-01-01T00:00:00Z'));
        expect(status).toBe('');

        vi.advanceTimersByTime(1500);
        const {status: notUpdatedStatus} = result.current;
        expect(notUpdatedStatus).toBe('');

        act(() => {
            mockDataListener(data);
            mockStatusListener('connected');
        });

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        const {status: updatedStatus} = result.current;
        expect(updatedStatus).toBe('connected');
    });

    it('should call connect and disconnect when mounted and unmounted', () => {
        const {unmount} = renderCustomHook();
        expect(mockConnect).toHaveBeenCalled();
        unmount();
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should not call connect and disconnect when updated', () => {
        const {rerender} = renderCustomHook();
        expect(mockConnect).toHaveBeenCalled();
        expect(mockDisconnect).not.toHaveBeenCalled();
        rerender();
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should NOT update price and date when dataListener is called with invalid data', () => {
        const {result} = renderCustomHook();

        act(() => {
            mockDataListener(data);
        });

        const {price: validPrice, date: validDate} = result.current;
        expect(validPrice).toBe(5);
        expect(validDate).toEqual(new Date('2023-01-01T00:00:00Z'));

        const invalidData: BTCData = {...data, p: 'invalid', T: Date.parse('2024-02-02T00:00:00Z')}
        act(() => {
            mockDataListener(invalidData);
        });

        const {price, date} = result.current;
        expect(price).toBe(5);
        expect(date).toEqual(new Date('2023-01-01T00:00:00Z'));
    });
});