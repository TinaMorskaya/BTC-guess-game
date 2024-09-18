import { afterEach, beforeEach, describe, expect, Mock } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useBTCCostUSD } from '../useBTCCostUSD.tsx';
import { BTCData } from '../../types.ts';
import { createBTCWebSocketService } from '../../api/createBTCWebSocketService.ts';

vi.mock('../../api/createBTCWebSocketService.ts');

describe('useBTCCostUSD', () => {
    const mockCreateBTCWebSocketService = createBTCWebSocketService as Mock;
    let mockDataListener: (data: BTCData) => void;
    let mockStatusListener: (status: string) => void;
    const mockConnect = vi.fn();
    const mockDisconnect = vi.fn();
    const renderCustomHook = () => renderHook(() => useBTCCostUSD());

    beforeEach(() => {
        mockCreateBTCWebSocketService.mockImplementation(({dataListener, statusListener}) => {
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
    });

    it('should return default price, date and status', () => {
        const {result} = renderCustomHook();
        const {price, date, status} = result.current;

        expect(price).toBeNull();
        expect(date).toBeNull();
        expect(status).toBe('');
    })

    it('should update price, date and status when dataListener and statusListener are called', () => {
        const {result} = renderCustomHook();

        const data: BTCData = {p: '5', T: Date.parse('2023-01-01T00:00:00Z'), ...vi.fn()()};
        act(() => {
            mockDataListener(data);
            mockStatusListener('connected');
        });

        const {price, date, status} = result.current;
        expect(price).toBe(5);
        expect(date).toEqual(new Date('2023-01-01T00:00:00Z'));
        expect(status).toBe('connected');
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

        const validData: BTCData = {p: '5', T: Date.parse('2023-01-01T00:00:00Z'), ...vi.fn()()};
        act(() => {
            mockDataListener(validData);
        });

        const {price: validPrice, date: validDate} = result.current;
        expect(validPrice).toBe(5);
        expect(validDate).toEqual(new Date('2023-01-01T00:00:00Z'));

        const data: BTCData = {p: 'invalid', T: Date.now(), ...vi.fn()()};
        act(() => {
            mockDataListener(data);
        });

        const {price, date} = result.current;
        expect(price).toBe(5);
        expect(date).toEqual(new Date('2023-01-01T00:00:00Z'));
    });
});