import { beforeEach, describe, expect } from 'vitest';
import { WebSocketMock } from '../mocks/webSocketMock.ts';
import { createBTCWebSocketService } from './createBTCWebSocketService.ts';

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
        ws.onopen();
        expect(statusListener).toHaveBeenCalledWith('WebSocket connected');
        ws.onmessage({data: JSON.stringify({p: '5', T: 1726769633375})});
        expect(dataListener).toHaveBeenCalledWith({p: '5', T: 1726769633375});
        expect(statusListener).toHaveBeenCalledWith('Successfully received data');
    });


    it('should close the WebSocket when disconnect is called', () => {
        const {connect, disconnect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        disconnect();
        expect(WebSocketMock.instances[0].close).toHaveBeenCalledTimes(1);
    });

    it('should return ErrorEvent message when WebSocket error is called', () => {
        const statusListener = vi.fn();
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        ws.onerror(new ErrorEvent('error', {message: 'test error'}));
        expect(statusListener).toHaveBeenCalledWith('WebSocket error:test error');
    });

    it('should return "An unknown error occurred" when WebSocket error is called with an unknown error', () => {
        const statusListener = vi.fn();
        const {connect} = createBTCWebSocketService({dataListener, statusListener});
        connect();
        const ws = WebSocketMock.instances[0];
        ws.onerror(new Event('error'));
        expect(statusListener).toHaveBeenCalledWith('An unknown error occurred');
    });
});