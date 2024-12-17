import { beforeEach, describe, expect, vi } from 'vitest';
import { WebSocketMock } from '../../mocks/webSocketMock.ts';
import { createBTCWebSocketService } from '../createBTCWebSocketService.ts';

describe('createBTCWebSocketService', () => {
    const dataListener = vi.fn();
    const statusListener = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal('WebSocket', WebSocketMock);
    });

    afterEach(() => {
        WebSocketMock.clearInstances();
        vi.unstubAllGlobals();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should create a WebSocket with the correct url and handle onopen, onmessage events', () => {
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();

        const url = import.meta.env.VITE_BITCOIN_COST_WS_URL;
        const ws = WebSocketMock.instances[0];
        expect(ws.url).toBe(url);

        ws.toggleOnOpen();
        expect(statusListener).toHaveBeenCalledWith('WebSocket connected');

        const data = {
            e: 'e',
            E: 1,
            s: 's',
            p: 'p',
            q: 'q',
            t: 1,
            m: true,
            M: true,
            T: 1
        };
        ws.toggleOnMessage(new MessageEvent('message', {data: JSON.stringify(data)}));
        expect(dataListener).toHaveBeenCalledWith({
            e: 'e',
            E: 1,
            s: 's',
            p: 'p',
            q: 'q',
            t: 1,
            m: true,
            M: true,
            T: 1
        });
        expect(statusListener).toHaveBeenCalledWith('Successfully received data');
    });

    it('should return ErrorEvent message when WebSocket error is called', () => {
        const statusListener = vi.fn();
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        ws.toggleOnError(new ErrorEvent('error', {message: 'test error'}));
        expect(statusListener).toHaveBeenCalledWith('WebSocket error:test error');
    });

    it('should return "An unknown error occurred" when WebSocket error is called with an unknown error', () => {
        const statusListener = vi.fn();
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        ws.toggleOnError(new Event('error'));
        expect(statusListener).toHaveBeenCalledWith('An unknown error occurred');
    });

    it('should reconnect when WebSocket onclose is called first time with delay of 100ms', () => {
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledTimes(2);
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');
        expect(ws.readyState).toBe(WebSocketMock.CLOSING);
        vi.advanceTimersByTime(99);
        // no reconnection attempt is made after 99ms
        expect(statusListener).toHaveBeenCalledTimes(2);
        vi.advanceTimersByTime(1);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 1...');
        expect(WebSocketMock.instances.length).toBe(1);
    });

    it('should reconnect when WebSocket onclose is called with delay of 150ms, 225ms, 338ms, 506ms, 759ms, 1139ms, ' +
        '1709ms, 2563ms, 3844ms, 5767ms, 8650ms, 10000ms, 10000ms', () => {
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');
        vi.advanceTimersByTime(100);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 1...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');
        vi.advanceTimersByTime(150);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 2...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.2 seconds...');
        vi.advanceTimersByTime(225);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 3...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.3 seconds...');
        vi.advanceTimersByTime(338);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 4...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.5 seconds...');
        vi.advanceTimersByTime(506);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 5...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.8 seconds...');
        vi.advanceTimersByTime(759);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 6...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 1.1 seconds...');
        vi.advanceTimersByTime(1139);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 7...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 1.7 seconds...');
        vi.advanceTimersByTime(1709);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 8...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 2.6 seconds...');
        vi.advanceTimersByTime(2563);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 9...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 3.8 seconds...');
        vi.advanceTimersByTime(3844);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 10...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 5.8 seconds...');
        vi.advanceTimersByTime(5767);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 11...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 8.7 seconds...');
        vi.advanceTimersByTime(8650);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 12...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 10.0 seconds...');
        vi.advanceTimersByTime(10000);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 13...');

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 10.0 seconds...');
        vi.advanceTimersByTime(10000);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 14...');
        expect(WebSocketMock.instances.length).toBe(1);
    });

    it('should clear timeout and cancel reconnection when disconnect is called', () => {
        const {connect, disconnect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];

        ws.toggleOnClose();
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');

        disconnect();

        vi.advanceTimersByTime(100);

        expect(WebSocketMock.instances.length).toBe(1);
        expect(statusListener).not.toHaveBeenCalledWith('Reconnection attempt 1...');

        expect(WebSocketMock.instances[0].readyState).toBe(WebSocketMock.CLOSED);
    });

    it('should not reconnect when reconnectAttempts > 1000', () => {
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        for (let i = 0; i < 1001; i++) {
            ws.toggleOnClose();
            vi.advanceTimersByTime(10000);
        }

        expect(statusListener).toHaveBeenCalledWith('Max reconnection attempts reached. Please refresh the page.');
        expect(WebSocketMock.instances.length).toBe(1);
    });

    it('should clear timeout when reconnect is called', () => {
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];

        ws.toggleOnClose();
        expect(ws.readyState).toBe(WebSocketMock.CLOSING);
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');
        expect(statusListener).toHaveBeenCalledTimes(2);
        vi.advanceTimersByTime(50);
        expect(statusListener).toHaveBeenCalledTimes(2);

        //Simulate reconnect call before timeout is reached
        ws.toggleOnClose();
        // reconnectTimeout is cleared and set again, so no reconnection attempt is made after 50ms+50ms
        vi.advanceTimersByTime(50);
        expect(statusListener).toHaveBeenCalledWith('WebSocket disconnected. Reconnecting...');
        expect(statusListener).toHaveBeenCalledWith('Connection lost. Reconnecting in 0.1 seconds...');
        expect(statusListener).toHaveBeenCalledTimes(4);

        // after 50ms+100ms, second reconnection attempt is made, skipping the first one
        vi.advanceTimersByTime(100);
        expect(statusListener).toHaveBeenCalledWith('Reconnection attempt 2...');
        expect(statusListener).toHaveBeenCalledTimes(5);
    });
});